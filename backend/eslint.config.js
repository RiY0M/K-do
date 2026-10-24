import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

// `npm run lint` had no config to use
export default [
    { ignores: ['dist', 'node_modules'] },
    ...tsPlugin.configs['flat/recommended'],
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            globals: globals.node,
        },
    },
    prettierConfig,
];
