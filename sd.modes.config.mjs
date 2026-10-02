import { readFileSync } from 'node:fs';

function collectionFormat(namespace, sourcePath) {
  return () => {
    const tokens = JSON.parse(
      readFileSync(new URL(sourcePath, import.meta.url), 'utf8'),
    );
    return `${JSON.stringify({ [namespace]: tokens }, null, 2)}\n`;
  };
}

export default {
  source: [
    'tokens/primitives/colors.json',
    'tokens/brands/colors.json',
    'tokens/typography/typography.json',
  ],
  hooks: {
    formats: {
      'tokens/brands-json': collectionFormat(
        'brands',
        './tokens/brands/colors.json',
      ),
      'tokens/typography-json': collectionFormat(
        'typography',
        './tokens/typography/typography.json',
      ),
    },
  },
  platforms: {
    json: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'brands.json',
          format: 'tokens/brands-json',
        },
        {
          destination: 'typography.json',
          format: 'tokens/typography-json',
        },
      ],
    },
  },
};