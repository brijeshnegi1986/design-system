"""Brand and theme are independent: every Brand mode pairs with the shared
Semantic Light and Dark modes, and Semantic {brand.*} references resolve
against the selected brand in both themes.

Run with `python3 -m unittest discover tests` (the dist checks need
`npm run tokens:build` first).
"""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKENS = ROOT / "tokens"
DIST = ROOT / "dist"

THEMES = ("Light", "Dark")
# Primitive colour family each brand's primary resolves to.
BRAND_PRIMARY = {
    "Base": "blue",
    "FortressMinds": "amber",
    "Jeshnegi": "purple",
    "NegiFlow": "sky",
}
REFERENCE = re.compile(r"^\{([^{}]+)\}$")
DECLARATION = re.compile(r"(--[a-z0-9-]+)\s*:\s*([^;]+);")
VAR = re.compile(r"^var\((--[a-z0-9-]+)\)$")


def load(relative):
    return json.loads((TOKENS / relative).read_text())


def flatten(*trees):
    flat = {}

    def walk(node, path):
        if "$value" in node:
            flat[".".join(path)] = node["$value"]
            return
        for key, value in node.items():
            if not key.startswith("$"):
                walk(value, path + (key,))

    for tree in trees:
        walk(tree, ())
    return flat


def resolve_chain(path, values, pattern):
    """Follow references from path; return every path visited."""
    chain = [path]
    while isinstance(value := values[chain[-1]], str) and (match := pattern.match(value.strip())):
        chain.append(match.group(1))
    return chain


class SourceCombinations(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.primitives = [load(f"primitives/{name}.json") for name in ("colors", "size", "spacing", "radius", "elevation")]
        cls.brands = load("brands/colors.json")
        cls.typography = load("typography/typography.json")
        cls.semantics = load("semantics/colors.json")
        cls.components = load("component/components.json")

    def combination(self, brand, theme):
        return flatten(
            *self.primitives,
            self.brands[brand],
            self.typography[brand],
            self.semantics[theme],
            self.components,
        )

    def test_semantic_modes_are_light_and_dark_only(self):
        self.assertEqual(set(self.semantics), set(THEMES))

    def test_brand_and_typography_modes_match(self):
        self.assertEqual(set(self.brands), set(BRAND_PRIMARY))
        self.assertEqual(set(self.typography), set(self.brands))

    def test_action_primary_resolves_to_selected_brand_in_both_themes(self):
        for brand, family in BRAND_PRIMARY.items():
            for theme in THEMES:
                with self.subTest(brand=brand, theme=theme):
                    chain = resolve_chain("color.action.primary", self.combination(brand, theme), REFERENCE)
                    self.assertIn("brand.color.primary", chain)
                    self.assertEqual(chain[-1].split(".")[0], family)


@unittest.skipUnless((DIST / "css/brands").is_dir(), "run `npm run tokens:build` first")
class DistributionCss(unittest.TestCase):
    def blocks(self, slug):
        """Variables in effect for the Light and Dark themes of one brand bundle."""
        shared = (DIST / "css/tokens.css").read_text() + (DIST / "css/components.css").read_text()
        brand_css = (DIST / f"css/brands/{slug}.css").read_text()
        root_css, rest = brand_css.split("@media", 1)
        dark_css = rest.split(':root[data-theme="dark"]', 1)[1]
        light = dict(DECLARATION.findall(shared + root_css))
        dark_overrides = dict(DECLARATION.findall(dark_css))
        return light, dark_overrides

    def test_semantics_json_has_two_modes(self):
        semantics = json.loads((DIST / "tokens/semantics.json").read_text())["semantics"]
        self.assertEqual(set(semantics), set(THEMES))

    def test_each_brand_css_resolves_its_own_primary_in_both_themes(self):
        for brand, family in BRAND_PRIMARY.items():
            light, dark_overrides = self.blocks(brand.lower())
            for theme, values in (("Light", light), ("Dark", {**light, **dark_overrides})):
                with self.subTest(brand=brand, theme=theme):
                    chain = resolve_chain("--color-action-primary", values, VAR)
                    self.assertIn("--brand-color-primary", chain)
                    self.assertTrue(chain[-1].startswith(f"--{family}-"), chain)

    def test_dark_theme_does_not_switch_brand(self):
        for brand in BRAND_PRIMARY:
            with self.subTest(brand=brand):
                _, dark_overrides = self.blocks(brand.lower())
                self.assertFalse([name for name in dark_overrides if name.startswith("--brand-")])


if __name__ == "__main__":
    unittest.main()
