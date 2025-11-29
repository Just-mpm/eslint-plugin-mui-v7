// ESLint config for testing the plugin
import plugin from './index.js';

export default [
  {
    files: ['test-example-clean.jsx'],
    plugins: {
      'mui-v7': plugin,
    },
    rules: {
      // Breaking changes - ERRORS
      'mui-v7/no-grid2-import': 'error',
      'mui-v7/no-grid-item-prop': 'error',
      'mui-v7/no-lab-imports': 'error',
      'mui-v7/no-deprecated-props': 'error',
      'mui-v7/no-deprecated-imports': 'error',
      'mui-v7/no-deep-imports': 'error',

      // Best practices - WARNINGS
      'mui-v7/prefer-slots-api': 'warn',
      'mui-v7/prefer-theme-vars': 'warn',
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
