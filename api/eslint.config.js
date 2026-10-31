import js from '@eslint/js';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

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
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      // #contract only resolves through tsconfig paths, so imports from it
      // must be erased. An inline `import { type X }` leaves a bare import
      // behind, which Node would try to resolve
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
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
