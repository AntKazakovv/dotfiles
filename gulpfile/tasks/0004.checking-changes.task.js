const {task} = require('gulp');

module.exports = function checkingChanges() {
    task('checking-changes', (cb) => {
        const currentBranch = this.execNativeShellSync('git rev-parse --abbrev-ref HEAD').trim();
        const diff = this.execNativeShellSync(`git diff origin/develop ${currentBranch} package-lock.json`);

        if (diff.length) {
            throw new Error('package-lock does not match, please rebase the branch.');
        }

        cb();
    });
};
