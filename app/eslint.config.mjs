import withNuxt from './.nuxt/eslint.config.mjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt(
  {
    files: ['**/*.{js,ts,vue}'],
    ignores: ['.gitignore', '**/*.css', '*.log*', '.nuxt', '.nitro', '.cache', '.output', '.env', 'dist', '.DS_Store'],
    rules: {
      camelcase: 'off',
      'no-extra-boolean-cast': 'off',
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
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-for-template-key': 'off',
      'vue/valid-attribute-name': 'off',
      'no-console': 'error',
      'no-restricted-globals': [
        'error',
        {
          name: 'window',
          message: 'Use useDom() instead',
        },
        {
          name: 'document',
          message: 'Use useDom() instead',
        },
      ],

      'import/order': [
        'error',
        {
          groups: [
            'builtin', // fs, path, URL...
            'external', // npm deps
            'internal', // #imports, @, ~, absolute project paths
            'parent', // ../
            'sibling', // ./
            'index', // index.js
            'object', // import('something')
            'type', // import type { Foo }
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always-and-inside-groups',
        },
      ],

      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-shadow': 'error',
      curly: ['error', 'all'],

      'no-undef': 'off',
      'no-unused-expressions': 'off',
    },
  },
  eslintPluginPrettierRecommended,
);
