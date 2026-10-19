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
