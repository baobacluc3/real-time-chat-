const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
module.exports = [{ files: ['**/*.ts'], languageOptions: { parser: tsparser, parserOptions: { project: './tsconfig.json', sourceType: 'module' } }, plugins: { '@typescript-eslint': tseslint }, rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] } }];
