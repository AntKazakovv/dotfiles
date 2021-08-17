const tasks = (arr) => arr.join(' && ');

module.exports = {
    hooks: {
        'pre-commit': [
            'ng lint',
        ],
        'pre-push': tasks([
            'npm run test',
            'npm run build:docs',
            'npm run build:sassdocs',
        ]),
    },
};
