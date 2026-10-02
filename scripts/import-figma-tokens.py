import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "docs" / "figma-export" / "extracted"
TOKENS = ROOT / "tokens"


def load(path):
    return json.loads(path.read_text())


def strip_extensions(value):
    """Remove Figma metadata while preserving token data."""
    if isinstance(value, dict):
        return {
            key: strip_extensions(val)
            for key, val in value.items()
            if key != "$extensions"
        }
    if isinstance(value, list):
        return [strip_extensions(item) for item in value]
    return value


def preserve_aliases(value):
    """Convert Figma alias metadata into standard token references."""
    if isinstance(value, dict):
        result = {
            key: preserve_aliases(val)
            for key, val in value.items()
        }
        alias_data = value.get("$extensions", {}).get(
            "com.figma.aliasData", {}
        )
        target = alias_data.get("targetVariableName")
        if target and "$value" in result:
            result["$value"] = "{" + target.replace("/", ".") + "}"
        return result
    if isinstance(value, list):
        return [preserve_aliases(item) for item in value]
    return value


def load_modes(collection):
    modes = {}
    for path in sorted((EXPORT / collection).glob("*.tokens.json")):
        mode = path.name[:-len(".tokens.json")]
        modes[mode] = strip_extensions(preserve_aliases(load(path)))
    return modes


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, indent=2) + "\n"
    )
    print(f"Generated: {path.relative_to(ROOT)}")


# Primitives
primitives = load(EXPORT / "Primitives" / "Mode 1.tokens.json")
write_json(
    TOKENS / "primitives" / "colors.json",
    strip_extensions(primitives),
)


# Brands
write_json(
    TOKENS / "brands" / "colors.json",
    load_modes("Brands"),
)


# Typography
write_json(
    TOKENS / "typography" / "typography.json",
    load_modes("Typography"),
)


# Semantics
light = load(EXPORT / "Semantics" / "Light.tokens.json")
dark = load(EXPORT / "Semantics" / "Dark.tokens.json")

def namespace_semantic_references(value, mode):
    if isinstance(value, dict):
        if "$value" in value and isinstance(value["$value"], str):
            value["$value"] = value["$value"].replace(
                "{color.", f"{{{mode}.color."
            )
        return {
            key: namespace_semantic_references(val, mode)
            for key, val in value.items()
        }

    if isinstance(value, list):
        return [namespace_semantic_references(item, mode) for item in value]

    return value

write_json(
    TOKENS / "semantics" / "colors.json",
    {
        "light": namespace_semantic_references(
            strip_extensions(light),
            "light",
        ),
        "dark": namespace_semantic_references(
            strip_extensions(dark),
            "dark",
        ),
    },
)


# Components
components = load(EXPORT / "Components" / "Mode 1.tokens.json")
write_json(
    TOKENS / "component" / "components.json",
    strip_extensions(components),
)


# Spacing
spacing = load(EXPORT / "Spacing" / "Mode 1.tokens.json")
write_json(
    TOKENS / "spacing" / "spacing.json",
    strip_extensions(spacing),
)


# Radius
radius = load(EXPORT / "Radius" / "Mode 1.tokens.json")
write_json(
    TOKENS / "radius" / "radius.json",
    strip_extensions(radius),
)


print("\nFigma token import complete.")
