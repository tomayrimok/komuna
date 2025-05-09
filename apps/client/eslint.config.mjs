import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  ...baseConfig,
  reactRefresh.configs.vite,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],
    },
  },
];
