/**
 * Builds the distributable token output from the normalised tokens/ sources.
 *
 * CSS keeps every Figma alias as a var() reference:
 *
 *   dist/css/tokens.css            all primitives (color, size, spacing, radius, elevation)
 *   dist/css/components.css        component tokens
 *   dist/css/brands/<brand>.css    Brand + Typography + Semantic Light in :root,
 *                                  Semantic Dark via prefers-color-scheme and [data-theme="dark"]
 *   dist/css/<brand>.css           bundle importing the three above
 *
 * JSON mirrors the token sources (references preserved) for non-CSS platforms:
 *
 *   dist/tokens/tokens.json        primitives + components
 *   dist/tokens/brands.json        { brands: { <mode>: ... } }
 *   dist/tokens/typography.json    { typography: { <mode>: ... } }
 *   dist/tokens/semantics.json     { semantics: { "<brand> Light|Dark": ... } }
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';
import baseConfig, { COMPONENT_SOURCE, PRIMITIVE_SOURCES } from '../sd.config.mjs';
import { THEMES, brandSlug, deepMerge, themeConfig } from '../sd.modes.config.mjs';

const ROOT = new URL('../', import.meta.url);
const DIST = new URL('dist/', ROOT);

const read = async (path) => JSON.parse(await readFile(new URL(path, ROOT), 'utf8'));
const write = async (path, content) => {
  const url = new URL(path, DIST);
  await mkdir(new URL('./', url), { recursive: true });
  await writeFile(url, content);
  console.log(`Generated: dist/${path}`);
};

const HEADER = '/**\n * Do not edit directly. Generated from the Figma NDS variables by scripts/build-tokens.mjs.\n */\n\n';

const block = (selector, body, indent = '') =>
  `${indent}${selector} {\n${body.split('\n').map((line) => indent + line).join('\n')}\n${indent}}\n`;

const collections = {
  primitives: await Promise.all(PRIMITIVE_SOURCES.map(read)),
  brands: await read('tokens/brands/colors.json'),
  typography: await read('tokens/typography/typography.json'),
  semantics: await read('tokens/semantics/colors.json'),
  components: await read(COMPONENT_SOURCE),
};

async function declarations(brand, theme) {
  const sd = new StyleDictionary(themeConfig({ brand, theme, collections }));
  const [file] = await sd.formatPlatform('css');
  return file.output;
}

await rm(DIST, { recursive: true, force: true });

// tokens.css + components.css (mode-independent)
const base = new StyleDictionary({ ...baseConfig, log: { ...baseConfig.log, verbosity: 'silent' } });
await base.buildAllPlatforms();
for (const { destination } of baseConfig.platforms.css.files) console.log(`Generated: dist/css/${destination}`);

// brands/<brand>.css and <brand>.css bundles
for (const brand of Object.keys(collections.brands)) {
  const slug = brandSlug(brand);
  const [light, dark] = await Promise.all(THEMES.map((theme) => declarations(brand, theme)));
  await write(
    `css/brands/${slug}.css`,
    HEADER +
      block(':root', light) +
      '\n@media (prefers-color-scheme: dark) {\n' +
      block(':root:not([data-theme="light"])', dark, '  ') +
      '}\n\n' +
      block(':root[data-theme="dark"]', dark),
  );
  await write(
    `css/${slug}.css`,
    HEADER + `@import "./tokens.css";\n@import "./components.css";\n@import "./brands/${slug}.css";\n`,
  );
}

// JSON (references preserved)
const json = (data) => JSON.stringify(data, null, 2) + '\n';
await write('tokens/tokens.json', json(deepMerge(...collections.primitives, collections.components)));
for (const name of ['brands', 'typography', 'semantics']) {
  await write(`tokens/${name}.json`, json({ [name]: collections[name] }));
}

// Package entry points: the package currently ships tokens only.
await write('index.js', 'export {};\n');
await write('index.d.ts', 'export {};\n');
