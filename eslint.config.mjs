import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
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
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {},
  },
];
