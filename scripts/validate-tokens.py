import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

TOKEN_FILES = [
    ROOT / "tokens/primitives/colors.json",
    ROOT / "tokens/brands/colors.json",
    ROOT / "tokens/typography/typography.json",
    ROOT / "tokens/semantics/colors.json",
    ROOT / "tokens/component/components.json",
    ROOT / "tokens/spacing/spacing.json",
    ROOT / "tokens/radius/radius.json",
]
MODES = {"Default", "Jeshnegi.com", "Negiflow.com", "FortressMinds"}

errors = []
loaded_tokens = {}

print("===== DESIGN SYSTEM TOKEN VALIDATION =====")

for path in TOKEN_FILES:
    relative = path.relative_to(ROOT)

    if not path.exists():
        errors.append(f"Missing: {relative}")
        continue

    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError as exc:
        errors.append(f"Invalid JSON: {relative} — {exc}")
        continue

    if not isinstance(data, dict):
        errors.append(f"Expected object: {relative}")
        continue

    loaded_tokens[relative.as_posix()] = data
    print(f"✓ {relative}")


def walk_tokens(data, path=()):
    if isinstance(data, dict):
        if "$value" in data:
            yield path, data["$value"]
            return
        for key, value in data.items():
            if key != "$extensions":
                yield from walk_tokens(value, path + (key,))
    elif isinstance(data, list):
        for index, value in enumerate(data):
            yield from walk_tokens(value, path + (str(index),))


def resolve_token(data, path):
    value = data
    for part in path.split("."):
        if not isinstance(value, dict) or part not in value:
            return False
        value = value[part]
    return isinstance(value, dict) and "$value" in value


primitive_path = "tokens/primitives/colors.json"
brand_path = "tokens/brands/colors.json"
typography_path = "tokens/typography/typography.json"
primitives = loaded_tokens.get(primitive_path, {})
brands = loaded_tokens.get(brand_path, {})
typography = loaded_tokens.get(typography_path, {})

for path, collection in ((brand_path, brands), (typography_path, typography)):
    if collection and set(collection) != MODES:
        errors.append(
            f"{path} modes must be {sorted(MODES)}; found {sorted(collection)}"
        )

primitive_colors = primitives.get("color", {})
for family in ("lime", "teal"):
    if not isinstance(primitive_colors.get(family), dict) or not primitive_colors[family]:
        errors.append(f"Missing primitive color family: color/{family}")

brand_references = []
for token_path, value in walk_tokens(brands):
    if isinstance(value, str) and value.startswith("{") and value.endswith("}"):
        reference = value[1:-1]
        brand_references.append(value)
        if not resolve_token(primitives, reference):
            errors.append(
                f"Unresolved Brand alias at {'.'.join(token_path)}: {value}"
            )


def validate_distribution():
    distribution_files = {
        "legacy": ROOT / "dist/tokens/tokens.json",
        "brands": ROOT / "dist/tokens/brands.json",
        "typography": ROOT / "dist/tokens/typography.json",
    }
    distribution = {}
    for name, path in distribution_files.items():
        if not path.exists():
            errors.append(f"Missing generated distribution: {path.relative_to(ROOT)}")
            continue
        try:
            distribution[name] = json.loads(path.read_text())
        except json.JSONDecodeError as exc:
            errors.append(f"Invalid generated JSON: {path.relative_to(ROOT)} — {exc}")

    legacy = distribution.get("legacy", {})

    for token_path in ("color", "light", "dark", "button", "1", "none"):
        if token_path not in legacy:
            errors.append(f"Existing token bundle is missing top-level key: {token_path}")

    for name, namespace in (
        ("brands", "brands"),
        ("typography", "typography"),
    ):
        data = distribution.get(name, {})
        modes = data.get(namespace, {})
        if set(modes) != MODES:
            errors.append(
                f"dist/tokens/{name}.json must contain {namespace} modes "
                f"{sorted(MODES)}; found {sorted(modes)}"
            )
        if name == "brands":
            output_references = [
                value
                for _, value in walk_tokens(modes)
                if isinstance(value, str)
                and value.startswith("{")
                and value.endswith("}")
            ]
            if Counter(output_references) != Counter(brand_references):
                errors.append("Generated Brand aliases differ from source references")
            for reference in output_references:
                if not resolve_token(primitives, reference[1:-1]):
                    errors.append(f"Unresolved generated Brand alias: {reference}")


if "--distribution" in sys.argv:
    validate_distribution()

# Prevent known accidental naming issues.
BAD_TERMS = [
    "Red 50",
    ".Inverse",
]

for path in (ROOT / "tokens").rglob("*.json"):
    text = path.read_text()

    for term in BAD_TERMS:
        if term in text:
            errors.append(
                f"Invalid token naming in {path.relative_to(ROOT)}: '{term}'"
            )

if errors:
    print("\n❌ TOKEN VALIDATION FAILED")

    for error in errors:
        print(f" - {error}")

    sys.exit(1)

print("\n✓ TOKEN VALIDATION PASSED")
