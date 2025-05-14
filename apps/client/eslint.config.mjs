import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'], // 1. Built-in and external modules
            ['internal'], // 2. Internal modules (if applicable)
            ['parent', 'sibling', 'index'], // 3. Parent, sibling, and index imports
          ],
          alphabetize: {
            order: 'asc', // Enforce alphabetical ordering
            caseInsensitive: true, // Ignore case while sorting
          },
        },
      ],
      // Prevent unused imports
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],

      // Enforce that no unused modules are present in import statements
      'import/no-unused-modules': [
        'warn',
        {
          unusedExports: true, // Checks for unused exports within the module
          missingExports: true, // Warns if the module is missing exports
        },
      ],
    },
  },
];
