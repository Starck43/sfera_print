import { defineConfig } from 'eslint/config'
import nextTypescript from 'eslint-config-next/typescript'
import reactCompiler from 'eslint-plugin-react-compiler'
import prettier from 'eslint-plugin-prettier'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import eslintNext from 'eslint-config-next'
import js from '@eslint/js'
import unusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
})

export default defineConfig([{
    extends: [...eslintNext, ...nextTypescript],
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
        'unused-imports': unusedImports,
        'react-compiler': reactCompiler,
        prettier
    },
    rules: {
        'react-compiler/react-compiler': 'warn',
        'prettier/prettier': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                'args': 'after-used',
                'argsIgnorePattern': '^_',
                'caughtErrors': 'all',
                'caughtErrorsIgnorePattern': '^_',
                'destructuredArrayIgnorePattern': '^_',
                'varsIgnorePattern': '^_',
                'ignoreRestSiblings': true
            }
        ],
        'unused-imports/no-unused-imports': 'warn'
    }
}, {
    files: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx']
}, {
    ignores: ['.next/', 'node_modules/', 'src/**/*.test.ts']
}])

