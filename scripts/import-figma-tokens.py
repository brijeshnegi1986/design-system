"""Import the Figma NDS variable export into the normalised tokens/ sources.

Reads docs/figma-export/extracted/<collection>/<mode>.tokens.json, checks that
each extracted folder still matches its zip, and writes one token file per
Figma collection. Nothing under docs/figma-export is ever written.

  * Figma alias metadata becomes a DTCG reference such as {blue.600}.
  * Values that are already references (e.g. {color.status.error}) are kept.
  * Figma $extensions are removed; $type, $value and $description are kept.
  * Single-mode collections are written unwrapped; multi-mode collections are
    keyed by their exact Figma mode name.
"""
import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT_ROOT = ROOT / "docs" / "figma-export"
EXTRACTED = EXPORT_ROOT / "extracted"
TOKENS = ROOT / "tokens"

# Figma collection name -> normalised token file. The export folder/zip name is
# the collection name with "/" written as "_" (Figma's file naming).
COLLECTIONS = {
    "NDS / Primitives / Color": "primitives/colors.json",
    "NDS / Primitives / Size": "primitives/size.json",
    "NDS / Primitives / Spacing": "primitives/spacing.json",
    "NDS / Primitives / Radius": "primitives/radius.json",
    "NDS / Primitives / Elevation": "primitives/elevation.json",
    "NDS / Brand / Color": "brands/colors.json",
    "NDS / Typography": "typography/typography.json",
    "NDS / Semantic / Color": "semantics/colors.json",
    "NDS / Components": "component/components.json",
}

REFERENCE = re.compile(r"^\{[^{}]+\}$")
MODE_SUFFIX = ".tokens.json"

errors = []


def export_name(collection):
    return collection.replace("/", "_")


def check_zip_matches(collection):
    """Fail if the extracted folder has drifted from the approved zip."""
    name = export_name(collection)
    archive = EXPORT_ROOT / f"{name}.zip"
    folder = EXTRACTED / name
    if not archive.exists():
        errors.append(f"Missing Figma export: {archive.relative_to(ROOT)}")
        return
    if not folder.is_dir():
        errors.append(f"Missing extracted export: {folder.relative_to(ROOT)}")
        return
    with zipfile.ZipFile(archive) as zf:
        zipped = {
            info.filename: zf.read(info)
            for info in zf.infolist()
            if info.filename.endswith(MODE_SUFFIX)
        }
    extracted = {path.name: path.read_bytes() for path in folder.glob(f"*{MODE_SUFFIX}")}
    if set(zipped) != set(extracted):
        errors.append(
            f"{name}: zip files {sorted(zipped)} differ from extracted {sorted(extracted)}"
        )
        return
    for filename, content in zipped.items():
        if json.loads(content) != json.loads(extracted[filename]):
            errors.append(f"{name}: extracted {filename} differs from the zip")


def walk(node, path=()):
    """Yield (path, token) for every token in a Figma export tree."""
    if isinstance(node, dict):
        if "$value" in node:
            yield path, node
            return
        for key, value in node.items():
            if not key.startswith("$"):
                yield from walk(value, path + (key,))


def normalise_token(token, context):
    """Return a runtime token: references preserved, Figma metadata removed."""
    result = {
        key: value
        for key, value in token.items()
        if key != "$extensions"
    }
    alias = token.get("$extensions", {}).get("com.figma.aliasData")
    if alias:
        target = alias.get("targetVariableName")
        target_set = alias.get("targetVariableSetName")
        if not target or not target_set:
            errors.append(f"{context}: incomplete Figma alias data {alias}")
        else:
            result["$value"] = "{" + target.replace("/", ".") + "}"
            result["_alias_collection"] = target_set
    return result


def normalise_tree(node, context=""):
    if isinstance(node, dict):
        if "$value" in node:
            return normalise_token(node, context)
        return {
            key: normalise_tree(value, f"{context}.{key}" if context else key)
            for key, value in node.items()
            if key != "$extensions"
        }
    return node


def load_collection(collection):
    folder = EXTRACTED / export_name(collection)
    modes = {}
    for path in sorted(folder.glob(f"*{MODE_SUFFIX}")):
        data = json.loads(path.read_text())
        mode = data.get("$extensions", {}).get("com.figma.modeName")
        file_mode = path.name[: -len(MODE_SUFFIX)]
        if mode != file_mode:
            errors.append(
                f"{collection}: file {path.name} declares mode {mode!r}"
            )
        modes[file_mode] = normalise_tree(data, collection)
    if not modes:
        errors.append(f"{collection}: no modes found")
    return modes


def token_paths(tree):
    return {".".join(path) for path, _ in walk(tree)}


def check_aliases(collections):
    """Every Figma alias must point at a token that exists in the named collection."""
    paths = {
        name: set().union(*(token_paths(mode) for mode in modes.values()))
        for name, modes in collections.items()
    }
    for name, modes in collections.items():
        for mode, tree in modes.items():
            for path, token in walk(tree):
                target_set = token.pop("_alias_collection", None)
                if target_set is None:
                    continue
                target = token["$value"][1:-1]
                if target_set not in collections:
                    errors.append(
                        f"{name}/{mode}: {'.'.join(path)} aliases unknown collection {target_set!r}"
                    )
                elif target not in paths[target_set]:
                    errors.append(
                        f"{name}/{mode}: {'.'.join(path)} aliases missing {target_set} token {target}"
                    )


def write_json(relative, data):
    path = TOKENS / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n")
    print(f"Generated: {path.relative_to(ROOT)}")


def main():
    for collection in COLLECTIONS:
        check_zip_matches(collection)
    if errors:
        fail()

    collections = {name: load_collection(name) for name in COLLECTIONS}
    check_aliases(collections)
    if errors:
        fail()

    for name, modes in collections.items():
        data = next(iter(modes.values())) if len(modes) == 1 else modes
        write_json(COLLECTIONS[name], data)
        aliases = sum(
            1
            for tree in modes.values()
            for _, token in walk(tree)
            if isinstance(token["$value"], str) and REFERENCE.match(token["$value"])
        )
        counts = {mode: len(token_paths(tree)) for mode, tree in modes.items()}
        print(f"  {name}: modes={counts} references={aliases}")

    print("\nFigma token import complete.")


def fail():
    print("\n❌ FIGMA TOKEN IMPORT FAILED")
    for error in errors:
        print(f" - {error}")
    sys.exit(1)


main()
