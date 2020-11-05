module.exports = {
    root: true,
    extends: ['plugin:@angular-eslint/recommended'],
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        '@angular-eslint/directive-selector': [
            'error',
            {type: 'attribute', prefix: 'wlc', style: 'kebab-case'},
        ],
        '@angular-eslint/component-selector': [
            'error',
            {type: 'class', prefix: 'wlc', style: 'kebab-case'},
        ],
        '@typescript-eslint/no-inferrable-types': 'off',
        'semi': ['error', 'always'],
        'quote-props': 'off',
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
