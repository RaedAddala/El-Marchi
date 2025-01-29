const nx = require('@nx/eslint-plugin');
const nestJSPlugin = require('@darraghor/eslint-plugin-nestjs-typed');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/coverage',
      '**/node_modules',
      '**/.next',
      '**/public',
    ],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@darraghor/nestjs-typed': nestJSPlugin,
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: 'type:server',
              onlyDependOnLibsWithTags: ['type:server', 'type:shared'],
            },
            {
              sourceTag: 'type:shared',
              onlyDependOnLibsWithTags: ['type:shared'],
            },
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],

      '@darraghor/nestjs-typed/controllers-should-supply-api-tags': 'off',
      '@darraghor/nestjs-typed/api-method-should-specify-api-response': 'off', // Disable this rule
      '@darraghor/nestjs-typed/provided-injected-should-match-factory-parameters':
        'error',

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  ...(nestJSPlugin.configs?.recommended.flat || []),
];
