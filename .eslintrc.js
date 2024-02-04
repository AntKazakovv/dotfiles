module.exports = {
    root: true,
    extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:sonarjs/recommended',
        'plugin:rxjs/recommended',
    ],
    plugins: [
        '@typescript-eslint',
        'optimize-regex',
        'sonarjs',
        'import',
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: [
            './tsconfig.json',
            './tsconfig.engine.json',
            './tsconfig.app.json',
        ],
    },
    rules: {
        '@angular-eslint/no-input-rename': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@angular-eslint/directive-selector': [
            'error',
            {type: 'attribute', prefix: 'wlc', style: 'kebab-case'},
        ],
        '@angular-eslint/component-selector': [
            'error',
            {type: 'attribute', prefix: 'wlc', style: 'kebab-case'},
        ],
        'optimize-regex/optimize-regex': ['warn', {
            'blacklist': ['charEscapeUnescape']
        }],
        "no-restricted-globals": ["error", "window", "globalThis"],
        'rxjs/no-async-subscribe': 'off',
        'rxjs/no-ignored-takewhile-value': 'off',
        'rxjs/no-nested-subscribe': 'off',
        'rxjs/no-implicit-any-catch': 'off',
        'sonarjs/cognitive-complexity': ['error', 140],
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-small-switch': 'off',
        'sonarjs/no-inverted-boolean-check': 'off',
        'quote-props': 'off',
        'no-console': ['error', {allow: ['warn', 'error']}],
        'no-debugger': 'error',
        'semi': ['error', 'always'],
        'no-restricted-imports': [
            'error', {
                'patterns': [
                    {
                        'group': ['lodash/*'],
                        'message': 'Lodash import should be done from lodash-es',
                    }
                ]
            }
        ],
        'comma-dangle': ['error', 'always-multiline'],
        'indent': ['error', 4, {
            'SwitchCase': 1,
            'ignoredNodes': [
                'PropertyDefinition[decorators]',
                'TSUnionType',
                'FunctionExpression[params]:has(Identifier[decorators])',
            ]
        }],
        'quotes': ['error', 'single'],
        'max-len': ['error', {code: 120}],
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowConciseArrowFunctionExpressionsStartingWithVoid: true,
                allowExpressions: true,
            },
        ],
        '@typescript-eslint/object-curly-spacing': ['error', 'never'],
        'import/no-cycle': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
    },
    overrides: [
        {
            files: ['*.component.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                project: [
                    './tsconfig.json',
                    './tsconfig.engine.json',
                    './tsconfig.app.json',
                ],
            },
            plugins: [
                '@angular-eslint/template',
            ],
            processor: '@angular-eslint/template/extract-inline-html',
        },
        {
            files: ['*.component.html'],
            rules: {
                '@angular-eslint/template/banana-in-a-box': 'error',
                '@angular-eslint/template/cyclomatic-complexity': 'error',
                '@angular-eslint/template/no-call-expression': 'error',
                '@angular-eslint/template/no-negated-async': 'error',
                '@angular-eslint/template/i18n': [
                    'error',
                    {
                        'checkId': false,
                        'checkText': true,
                        'checkAttributes': true,
                        'ignoreAttributes': [
                            'field',
                            'identifier',
                        ],
                    },
                ],
            },
        },
        {
            files: ['*.component.ts'],
            rules: {
                '@angular-eslint/prefer-on-push-component-change-detection': 'error',
            },
        },
    ],
};
