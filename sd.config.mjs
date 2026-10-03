/**
 * Style Dictionary config for the mode-independent collections: the five
 * primitive collections and Components. Mode-aware collections (Brand,
 * Typography, Semantic) are built per brand/theme by sd.modes.config.mjs.
 *
 * Can be run alone with `style-dictionary build --config sd.config.mjs`;
 * `npm run tokens:build` runs it through scripts/build-tokens.mjs.
 */
import StyleDictionary from 'style-dictionary';

export const PRIMITIVE_SOURCES = [
  'tokens/primitives/colors.json',
  'tokens/primitives/size.json',
  'tokens/primitives/spacing.json',
  'tokens/primitives/radius.json',
  'tokens/primitives/elevation.json',
];
export const COMPONENT_SOURCE = 'tokens/component/components.json';

// Figma exports dimensions as unitless numbers; CSS needs px. Font weights are
// numbers too but must stay unitless.
const isFontWeight = (token) => token.path.some((segment) => segment.includes('weight'));

export const numberPx = {
  type: 'value',
  filter: (token) => (token.$type ?? token.type) === 'number' && !isFontWeight(token),
  transform: (token) => `${token.$value ?? token.value}px`,
};

export const cssTransforms = [...StyleDictionary.hooks.transformGroups.css, 'number/px'];

const fromSources = (sources) => (token) => sources.includes(token.filePath);

export default {
  source: [...PRIMITIVE_SOURCES, COMPONENT_SOURCE],
  usesDtcg: true,
  log: { warnings: 'disabled' },
  hooks: {
    transforms: { 'number/px': numberPx },
  },
  platforms: {
    css: {
      transforms: cssTransforms,
      buildPath: 'dist/css/',
      options: { outputReferences: true },
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          filter: fromSources(PRIMITIVE_SOURCES),
        },
        {
          destination: 'components.css',
          format: 'css/variables',
          filter: fromSources([COMPONENT_SOURCE]),
        },
      ],
    },
  },
};
