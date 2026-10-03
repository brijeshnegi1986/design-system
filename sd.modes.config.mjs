/**
 * Style Dictionary configs for the mode-aware collections.
 *
 * Brand and Typography modes are keyed by brand ("Base", "Jeshnegi.com", ...).
 * Semantic themes are keyed "<brand> Light" / "<brand> Dark", where <brand> is
 * the Brand mode without ".com". Each brand/theme pairing is formatted against
 * the full token set so references resolve, but only emits its own tokens:
 *
 *   Light: Brand + Typography + Semantic Light
 *   Dark:  Semantic Dark (Brand and Typography do not change with the theme)
 */
import { formattedVariables } from 'style-dictionary/utils';
import { cssTransforms, numberPx } from './sd.config.mjs';

export const THEMES = ['Light', 'Dark'];

export const brandKey = (mode) => mode.replace(/\.com$/, '');

// "Negiflow.com" -> "negiflow", "FortressMinds" -> "fortressminds"
export const brandSlug = (mode) =>
  brandKey(mode).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const themeName = (brand, theme) => `${brandKey(brand)} ${theme}`;

const isToken = (node) => node && typeof node === 'object' && '$value' in node;

/** Merges token trees, failing on any path defined twice. */
export function deepMerge(...sources) {
  const merge = (target, source, path) => {
    for (const [key, value] of Object.entries(source)) {
      if (key in target) {
        if (isToken(value) || isToken(target[key])) {
          throw new Error(`Token collision at ${[...path, key].join('.')}`);
        }
        merge(target[key], value, [...path, key]);
      } else {
        target[key] = isToken(value) ? value : merge({}, value, [...path, key]);
      }
    }
    return target;
  };
  return sources.reduce((out, source) => merge(out, source, []), {});
}

export const tokenPaths = (tree, prefix = []) =>
  Object.entries(tree).flatMap(([key, value]) =>
    isToken(value) ? [[...prefix, key].join('.')] : tokenPaths(value, [...prefix, key]),
  );

/**
 * @param {object} options
 * @param {string} options.brand  Brand mode name
 * @param {'Light'|'Dark'} options.theme
 * @param {object} options.collections  { primitives: object[], brands, typography, semantics, components }
 */
export function themeConfig({ brand, theme, collections }) {
  const { primitives, brands, typography, semantics, components } = collections;
  const semantic = semantics[themeName(brand, theme)];
  if (!brands[brand] || !typography[brand] || !semantic) {
    throw new Error(`Incomplete modes for ${brand} / ${theme}`);
  }
  const own = theme === 'Light' ? [brands[brand], typography[brand], semantic] : [semantic];
  const paths = new Set(own.flatMap((tree) => tokenPaths(tree)));

  return {
    tokens: deepMerge(...primitives, brands[brand], typography[brand], semantic, components),
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'disabled' },
    hooks: {
      transforms: { 'number/px': numberPx },
      formats: {
        'css/declarations': ({ dictionary }) =>
          formattedVariables({ format: 'css', dictionary, outputReferences: true, usesDtcg: true }),
      },
    },
    platforms: {
      css: {
        transforms: cssTransforms,
        files: [
          {
            destination: 'declarations',
            format: 'css/declarations',
            filter: (token) => paths.has(token.path.join('.')),
          },
        ],
      },
    },
  };
}
