const tasks = (arr) => arr.join(' && ');

module.exports = {
    hooks: {
        'pre-commit': [
            'lint-staged',
        ],
        'pre-push': tasks([
            'npm run test',
            'npm run build:docs',
            'npm run build:sassdocs',
        ]),
        'commit-msg': [
            'gulp githook:commit-msg --params "$HUSKY_GIT_PARAMS"',
            'gulp githook:checking-changes --params "$HUSKY_GIT_PARAMS"',
        ]
    },
};
