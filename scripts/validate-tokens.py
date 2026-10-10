"""Validate the normalised tokens/ sources and, with --distribution, dist/.

Source checks:
  * every collection file exists, is valid JSON and has no Figma $extensions
  * Brand and Typography share the same modes; Semantic has exactly a Light
    and a Dark theme, shared by every brand; all modes of a collection have
    identical paths
  * token paths are unique across collections (Figma aliases are by name)
  * references respect the collection layering and resolve without cycles in
    every brand/theme combination (Semantic {brand.*} references resolve
    against the selected Brand mode)

Distribution checks (--distribution):
  * every expected dist file exists and contains no $extensions
  * each brand CSS bundle defines exactly the expected variables, once
  * every var() reference is defined; no {reference} is left unresolved
  * light and dark blocks cover the same semantic variables
  * dimensional numbers carry px; font weights stay unitless
  * JSON output mirrors the token sources with references preserved
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "docs" / "figma-export" / "extracted"
DIST = ROOT / "dist"

PRIMITIVES = {
    "primitives/colors": ROOT / "tokens/primitives/colors.json",
    "primitives/size": ROOT / "tokens/primitives/size.json",
    "primitives/spacing": ROOT / "tokens/primitives/spacing.json",
    "primitives/radius": ROOT / "tokens/primitives/radius.json",
    "primitives/elevation": ROOT / "tokens/primitives/elevation.json",
}
TOKEN_FILES = {
    **PRIMITIVES,
    "brands": ROOT / "tokens/brands/colors.json",
    "typography": ROOT / "tokens/typography/typography.json",
    "semantics": ROOT / "tokens/semantics/colors.json",
    "components": ROOT / "tokens/component/components.json",
}
MULTI_MODE = {"brands", "typography", "semantics"}
THEMES = ("Light", "Dark")

# Which collections each layer may reference. Primitives stay raw values.
ALLOWED_REFERENCES = {
    "primitives": {"primitives"},
    "brands": {"primitives"},
    "typography": {"primitives"},
    "semantics": {"primitives", "brands", "semantics"},
    "components": {"primitives", "brands", "typography", "semantics", "components"},
}

REFERENCE = re.compile(r"^\{([^{}]+)\}$")

errors = []
warnings = []
tokens = {}


def layer(name):
    return name.split("/")[0]


def brand_slug(mode):
    """'NegiFlow' -> 'negiflow'; a '.com' suffix is dropped."""
    return re.sub(r"[^a-z0-9]+", "-", mode.removesuffix(".com").lower()).strip("-")


def walk_tokens(data, path=()):
    """Yield (dotted path, token) for every leaf token."""
    if isinstance(data, dict):
        if "$value" in data:
            yield ".".join(path), data
            return
        for key, value in data.items():
            if not key.startswith("$"):
                yield from walk_tokens(value, path + (key,))


def flatten(*trees):
    flat = {}
    for tree in trees:
        for path, token in walk_tokens(tree):
            flat[path] = token
    return flat


def is_reference(value):
    return isinstance(value, str) and REFERENCE.match(value) is not None


def css_name(path):
    return "--" + path.replace(".", "-").lower()


# ---------------------------------------------------------------------------
# Source validation
# ---------------------------------------------------------------------------

def load_sources():
    for name, path in TOKEN_FILES.items():
        relative = path.relative_to(ROOT)
        if not path.exists():
            errors.append(f"Missing: {relative}")
            continue
        text = path.read_text()
        try:
            data = json.loads(text)
        except json.JSONDecodeError as exc:
            errors.append(f"Invalid JSON: {relative} — {exc}")
            continue
        if not isinstance(data, dict) or not data:
            errors.append(f"Expected a non-empty object: {relative}")
            continue
        if "$extensions" in text:
            errors.append(f"Figma $extensions left in runtime tokens: {relative}")
        tokens[name] = data
        print(f"✓ {relative}")


def check_modes():
    for name in MULTI_MODE:
        for mode, tree in tokens[name].items():
            if "$value" in tree or not isinstance(tree, dict):
                errors.append(f"{name}: top-level key {mode!r} is not a mode")
        paths = {mode: set(flatten(tree)) for mode, tree in tokens[name].items()}
        first, *rest = paths
        for mode in rest:
            if paths[mode] != paths[first]:
                diff = sorted(paths[mode] ^ paths[first])
                errors.append(f"{name} modes {first!r} and {mode!r} differ: {diff[:5]}")

    brands = set(tokens["brands"])
    if set(tokens["typography"]) != brands:
        errors.append(
            f"Typography modes {sorted(tokens['typography'])} do not match Brand modes {sorted(brands)}"
        )
    expected = set(THEMES)
    found = set(tokens["semantics"])
    if found != expected:
        errors.append(
            f"Semantic modes must be exactly {sorted(expected)}; "
            f"missing {sorted(expected - found)}, unexpected {sorted(found - expected)}"
        )


def path_sets():
    """Token paths per collection (union across modes)."""
    sets = {}
    for name, data in tokens.items():
        trees = data.values() if name in MULTI_MODE else [data]
        sets[name] = set().union(*(flatten(tree) for tree in trees))
    return sets


def check_unique_paths(sets):
    owner = {}
    for name, paths in sets.items():
        for path in paths:
            if path in owner:
                errors.append(f"Token path {path} defined in both {owner[path]} and {name}")
            owner[path] = name
    return owner


def check_layering(owner):
    for name, data in tokens.items():
        trees = data.items() if name in MULTI_MODE else [("", data)]
        for mode, tree in trees:
            for path, token in walk_tokens(tree):
                if not is_reference(token["$value"]):
                    continue
                target = REFERENCE.match(token["$value"]).group(1)
                target_owner = owner.get(target)
                label = f"{name}/{mode}" if mode else name
                if target_owner is None:
                    errors.append(f"{label}: {path} references missing {token['$value']}")
                elif layer(target_owner) not in ALLOWED_REFERENCES[layer(name)]:
                    errors.append(
                        f"{label}: {path} references {target_owner} token {target}; "
                        f"{layer(name)} may only reference {sorted(ALLOWED_REFERENCES[layer(name)])}"
                    )


def combination(brand, theme):
    """Every token visible to one brand/theme pairing: the theme's semantics
    resolve against the selected brand and typography modes."""
    return flatten(
        *(tokens[name] for name in PRIMITIVES),
        tokens["brands"][brand],
        tokens["typography"][brand],
        tokens["semantics"][theme],
        tokens["components"],
    )


def resolve(path, available, label):
    """Follow a reference chain; report missing targets and cycles."""
    seen = [path]
    value = available[path]["$value"]
    while is_reference(value):
        target = REFERENCE.match(value).group(1)
        if target not in available:
            errors.append(f"{label}: {path} references missing {value}")
            return None
        if target in seen:
            errors.append(f"{label}: reference cycle {' -> '.join(seen + [target])}")
            return None
        seen.append(target)
        value = available[target]["$value"]
    return value


def check_combinations():
    for brand in sorted(tokens["brands"]):
        for theme in THEMES:
            available = combination(brand, theme)
            for path in available:
                resolve(path, available, f"{brand}/{theme}")


def figma_code_syntax():
    """Figma WEB code syntax per token path (for compatibility warnings)."""
    syntax = {}
    for file in EXPORT.rglob("*.tokens.json"):
        data = json.loads(file.read_text())

        def visit(node, path=()):
            if not isinstance(node, dict):
                return
            if "$value" in node:
                web = node.get("$extensions", {}).get("com.figma.codeSyntax", {}).get("WEB")
                if web:
                    syntax[".".join(path)] = web
                return
            for key, value in node.items():
                if not key.startswith("$"):
                    visit(value, path + (key,))

        visit(data)
    return syntax


def check_code_syntax(owner):
    for path, web in sorted(figma_code_syntax().items()):
        if path in owner and web != f"var({css_name(path)})":
            warnings.append(f"{path}: CSS emits var({css_name(path)}); Figma code syntax says {web}")


def report_counts():
    print("\nToken counts:")
    for name, data in tokens.items():
        if name in MULTI_MODE:
            counts = {mode: len(flatten(tree)) for mode, tree in data.items()}
            refs = sum(
                is_reference(token["$value"])
                for tree in data.values()
                for _, token in walk_tokens(tree)
            )
            print(f"  {name}: {len(counts)} modes × {next(iter(counts.values()))} tokens, {refs} references")
        else:
            flat = flatten(data)
            refs = sum(is_reference(token["$value"]) for token in flat.values())
            print(f"  {name}: {len(flat)} tokens, {refs} references")
    print("Brand/theme combinations:")
    for brand in sorted(tokens["brands"]):
        print(f"  {brand}: " + ", ".join(f"{brand} + {theme}" for theme in THEMES))


# ---------------------------------------------------------------------------
# Distribution validation
# ---------------------------------------------------------------------------

DECLARATION = re.compile(r"(--[a-z0-9-]+)\s*:\s*([^;]+);")


def declarations(css):
    return DECLARATION.findall(css)


def is_font_weight(path):
    return any("weight" in segment for segment in path.split("."))


def expected_number_css(path, token):
    """How a number token should appear in CSS (None for references)."""
    if is_reference(token["$value"]):
        return None
    if is_font_weight(path):
        return f"{token['$value']}"
    return f"{token['$value']}px"


def validate_distribution():
    brands = sorted(tokens["brands"])
    required = [
        "css/tokens.css",
        "css/components.css",
        "tokens/tokens.json",
        "tokens/brands.json",
        "tokens/typography.json",
        "tokens/semantics.json",
        "index.js",
        "index.d.ts",
    ]
    for brand in brands:
        slug = brand_slug(brand)
        required += [f"css/brands/{slug}.css", f"css/{slug}.css"]
    for relative in required:
        if not (DIST / relative).exists():
            errors.append(f"Missing generated distribution: dist/{relative}")
    if errors:
        return
    for file in DIST.rglob("*"):
        if file.is_file() and "$extensions" in file.read_text():
            errors.append(f"Figma $extensions in dist/{file.relative_to(DIST)}")

    base = (DIST / "css/tokens.css").read_text()
    components = (DIST / "css/components.css").read_text()

    for brand in brands:
        slug = brand_slug(brand)
        label = f"css/brands/{slug}.css"
        bundle_file = (DIST / f"css/{slug}.css").read_text()
        for imported in ("./tokens.css", "./components.css", f"./brands/{slug}.css"):
            if f'@import "{imported}";' not in bundle_file:
                errors.append(f"css/{slug}.css does not import {imported}")

        brand_css = (DIST / label).read_text()
        if "@media" not in brand_css or ':root[data-theme="dark"]' not in brand_css:
            errors.append(f"{label}: missing dark theme blocks")
            continue
        root_css = brand_css.split("@media")[0]
        media_css = brand_css.split("@media")[1].split(':root[data-theme="dark"]')[0]
        dark_css = brand_css.split(':root[data-theme="dark"]')[1]

        root = declarations(base) + declarations(components) + declarations(root_css)
        names = [name for name, _ in root]
        duplicates = sorted({name for name in names if names.count(name) > 1})
        if duplicates:
            errors.append(f"{label}: variables defined twice: {duplicates[:5]}")
        defined = dict(root)

        if dict(declarations(media_css)) != dict(declarations(dark_css)):
            errors.append(f"{label}: media-query and data-theme dark blocks differ")

        semantic_paths = flatten(tokens["semantics"]["Light"])
        semantic_names = {css_name(path) for path in semantic_paths}
        if set(dict(declarations(dark_css))) != semantic_names:
            errors.append(f"{label}: dark block does not cover exactly the semantic variables")

        light = combination(brand, "Light")
        expected_names = {css_name(path) for path in light}
        if set(defined) != expected_names:
            errors.append(
                f"{label} bundle variables differ from tokens; "
                f"missing {sorted(expected_names - set(defined))[:5]}, "
                f"extra {sorted(set(defined) - expected_names)[:5]}"
            )

        all_css = base + components + brand_css
        for used in sorted(set(re.findall(r"var\((--[a-z0-9-]+)\)", all_css)) - set(defined)):
            errors.append(f"{label} bundle: var({used}) is never defined")
        if re.search(r":\s*[^;]*\{[^{}]+\}\s*;", all_css):
            errors.append(f"{label} bundle: unresolved {{reference}} in CSS output")

        for theme, block in (("Light", root), ("Dark", declarations(dark_css))):
            values = dict(block)
            for path, token in combination(brand, theme).items():
                value = values.get(css_name(path))
                if value is None:
                    continue
                value = value.split("/**")[0].strip()
                if is_reference(token["$value"]):
                    target = css_name(REFERENCE.match(token["$value"]).group(1))
                    if value != f"var({target})":
                        errors.append(f"{label}/{theme}: {path} should be var({target}), got {value}")
                elif token.get("$type") == "number":
                    expected = expected_number_css(path, token)
                    if value != expected:
                        errors.append(f"{label}/{theme}: {path} should be {expected}, got {value}")

    bundle = json.loads((DIST / "tokens/tokens.json").read_text())
    expected = flatten(*(tokens[name] for name in PRIMITIVES), tokens["components"])
    if flatten(bundle) != expected:
        errors.append("dist/tokens/tokens.json does not mirror primitives + components")
    for name in MULTI_MODE:
        data = json.loads((DIST / f"tokens/{name}.json").read_text()).get(name)
        if data != tokens[name]:
            errors.append(f"dist/tokens/{name}.json does not mirror tokens/ {name}")


load_sources()

if len(tokens) == len(TOKEN_FILES):
    check_modes()
    sets = path_sets()
    owner = check_unique_paths(sets)
    check_layering(owner)
    if not errors:
        check_combinations()
    check_code_syntax(owner)
    report_counts()
    if "--distribution" in sys.argv and not errors:
        validate_distribution()

if warnings:
    print(f"\n⚠ {len(warnings)} Figma code-syntax names differ from the emitted CSS names:")
    for warning in warnings:
        print(f" - {warning}")

if errors:
    print("\n❌ TOKEN VALIDATION FAILED")
    for error in errors:
        print(f" - {error}")
    sys.exit(1)

print("\n✓ TOKEN VALIDATION PASSED" + (" (including distribution)" if "--distribution" in sys.argv else ""))
