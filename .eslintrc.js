module.exports = {
    root: true,
    extends: ['plugin:@angular-eslint/recommended'],
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        "no-console": ["error", { allow: ["warn", "error"] }],
        "no-debugger": "error",
        '@angular-eslint/no-input-rename': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        'quote-props': 'off',
        '@angular-eslint/directive-selector': [
            'error',
            {type: 'attribute', prefix: 'wlc', style: 'kebab-case'},
        ],
        '@angular-eslint/component-selector': [
            'error',
            {type: 'attribute', prefix: 'wlc', style: 'kebab-case'},
        ],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'indent': ['error', 4, {'SwitchCase': 1}],
    },
    overrides: [
        {
            files: ['*.component.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: '2020',
                sourceType: 'module',
                // project: [
                //     './tsconfig.json',
                //     './tsconfig.engine.json',
                //     './tsconfig.app.json',
                // ],
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
    ],
};
