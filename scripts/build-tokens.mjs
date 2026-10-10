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
 *   dist/tokens/semantics.json     { semantics: { Light: ..., Dark: ... } }
 *
 * dist/ is updated in place, never deleted first: consuming apps (e.g. a
 * Next.js dev server reading dist/css through a file: dependency) would
 * otherwise see the files vanish mid-build and cache "file not found".
 * Each file is written to a temporary name and renamed over the old one,
 * and files a previous build left behind (a removed brand) are deleted at
 * the end.
 */
import { mkdir, readdir, readFile, rename, rm, rmdir, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';
import baseConfig, { COMPONENT_SOURCE, PRIMITIVE_SOURCES } from '../sd.config.mjs';
import { THEMES, brandSlug, deepMerge, themeConfig } from '../sd.modes.config.mjs';

const ROOT = new URL('../', import.meta.url);
const DIST = new URL('dist/', ROOT);

/** Every dist/ path this build produced, so leftovers can be removed afterwards. */
const generated = new Set();

const read = async (path) => JSON.parse(await readFile(new URL(path, ROOT), 'utf8'));
const write = async (path, content) => {
  const url = new URL(path, DIST);
  const tmp = new URL(`${path}.${process.pid}.tmp`, DIST);
  await mkdir(new URL('./', url), { recursive: true });
  await writeFile(tmp, content);
  await rename(tmp, url);
  generated.add(path);
  console.log(`Generated: dist/${path}`);
};

/** Deletes files under dist/ this build didn't produce, then any directories left empty. */
async function removeLeftovers(dir = fileURLToPath(DIST), prefix = '') {
  let empty = true;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = prefix + entry.name;
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (await removeLeftovers(full, `${path}/`)) await rmdir(full);
      else empty = false;
    } else if (generated.has(path)) {
      empty = false;
    } else {
      await rm(full);
      console.log(`Removed: dist/${path}`);
    }
  }
  return empty;
}

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

// tokens.css + components.css (mode-independent), written through write() like everything else
const base = new StyleDictionary({ ...baseConfig, log: { ...baseConfig.log, verbosity: 'silent' } });
// (formatPlatform's destination is relative to the repo root, e.g. "dist/css/tokens.css")
for (const { destination, output } of await base.formatPlatform('css')) {
  await write(relative(fileURLToPath(DIST), resolve(fileURLToPath(ROOT), destination)), output);
}

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

await removeLeftovers();
