import nx from '@nx/eslint-plugin';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      'unused-imports': eslintPluginUnusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    },
  },
];
