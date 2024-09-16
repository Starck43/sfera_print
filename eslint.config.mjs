import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import unusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
})

const config = [
    ...fixupConfigRules(
        compat.extends(
            'next/core-web-vitals',
            //'next/typescript',
            //'eslint:recommended',
            //'plugin:react/recommended',
            'plugin:react-hooks/recommended',
            'plugin:@typescript-eslint/recommended'
            //'prettier'
        )
    ),
    {
        settings: {
            react: {
                version: 'detect'
            },

            'import/resolver': {
                node: {
                    paths: ['.'],
                    extensions: ['.js', '.jsx', '.ts', '.tsx']
                }
            }
        },
        plugins: {
            'unused-imports': unusedImports
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true
                }
            ],
            'unused-imports/no-unused-imports': 'warn'
        }
    },
    {
        files: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx']
    },
    {
        ignores: ['.next/', 'node_modules/', 'src/**/*.test.ts']
    }
]

export default config
