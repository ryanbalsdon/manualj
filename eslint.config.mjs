// ESLint configuration for TypeScript project (ESM)
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // JavaScript configuration
  js.configs.recommended,
  
  // TypeScript configuration
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', '**/*.d.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      ...ts.configs['recommended-type-checked'].rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  
  // Test configuration
  {
    files: ['**/*.test.ts'],
    env: {
      jest: true,
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  }
];