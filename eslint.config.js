import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const sharedConfig = {
  plugins: {
    '@typescript-eslint': typescriptEslint,
    import: eslintPluginImport,
    'unused-imports': eslintPluginUnusedImports,
    prettier: prettierPlugin
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',

    // Unused imports
    'unused-imports/no-unused-imports': 'warn',

    // Import order (optional)
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
      },
    ],

    // Prettier
    'prettier/prettier': 'warn'
  },
}

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaVersion: 2022,
      },
    },
    ...sharedConfig,
  },
  {
    files: ['**/*.test.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaVersion: 2022,
      },
    },
    ...sharedConfig,
  },
  {
    ignores: ['dist/', 'coverage/'],
  },
  prettierConfig,
];
