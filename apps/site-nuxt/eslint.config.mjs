import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  files: ['**/*.vue'],
  rules: {
    'vue/html-self-closing': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-v-html': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['transition', 'client-only', 'component', 'transition-group'],
      },
    ],
    'vue/comment-directive': 'off',
    'vue/valid-attribute-name': 'off',
    'no-console': 'error',
    curly: ['error', 'all'],
    'no-undef': 'off',
    'no-unused-expressions': 'off',
  },
});
