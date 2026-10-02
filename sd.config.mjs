export default {
  source: [
    'tokens/primitives/colors.json',
    'tokens/semantics/colors.json',
    'tokens/component/components.json',
    'tokens/spacing/spacing.json',
    'tokens/radius/radius.json'
  ],
  platforms: {
    json: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json'
        }
      ]
    }
  }
};
