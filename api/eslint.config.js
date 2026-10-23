import js from '@eslint/js';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

// the contract is types only. Node can't resolve #contract at runtime, so it
// must only be imported with `import type`, which is erased before resolving
const contractImports = {
  patterns: [
    {
      // not `group`: its gitignore syntax reads a leading # as a comment
      regex: '^#contract/',
      message: 'Import the contract with `import type`.',
    },
  ],
};

export default [
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'import/no-anonymous-default-export': 'off',
      'no-console': 'warn',
      'no-param-reassign': 'warn',
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-restricted-imports': ['error', contractImports],
    },
  },
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.ts'],
  })),
  {
    files: ['**/*.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: contractImports.patterns.map(pattern => ({
            ...pattern,
            allowTypeImports: true,
          })),
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
    },
  },
  {
    ignores: ['.yarn/**'],
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': 'warn',
    },
  },
];
