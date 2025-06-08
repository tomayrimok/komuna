import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: [],
    // Override or add rules here
    rules: {
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
// '**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'