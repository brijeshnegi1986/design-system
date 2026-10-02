import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

TOKEN_FILES = [
    ROOT / "tokens/primitives/colors.json",
    ROOT / "tokens/semantics/colors.json",
    ROOT / "tokens/component/components.json",
    ROOT / "tokens/spacing/spacing.json",
    ROOT / "tokens/radius/radius.json",
]

errors = []

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

    print(f"✓ {relative}")

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
