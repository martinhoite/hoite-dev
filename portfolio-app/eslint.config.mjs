import withNuxt from './.nuxt/eslint.config.mjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt(
  {
    files: ['**/*.vue', '**/*.js', '**/*.ts'],
    ignores: ['.gitignore', '*.log*', '.nuxt/*', '.nitro', '.cache', '.output/*', '.env', 'dist', '.DS_Store'],
    rules: {
      camelcase: 'off',
      'no-extra-boolean-cast': 'off',
      'vue/no-v-html': 'off',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['transition', 'client-only', 'component', 'transition-group']
        }
      ],
      'vue/comment-directive': 'off',
      semi: ['error', 'always'],
      'vue/singleline-html-element-content-newline': 'off',
      'import/order': ['off'],
      'vue/html-indent': 'error',
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-for-template-key': 'off',
      'vue/html-self-closing': 'off',
      'vue/valid-attribute-name': 'off',
      'no-console': 'error',
      'no-restricted-globals': [
        'error',
        {
          name: 'window',
          message: 'Use useDOM() instead'
        },
        {
          name: 'document',
          message: 'Use useDOM() instead'
        }
      ]
    }
  },
  eslintPluginPrettierRecommended
);
