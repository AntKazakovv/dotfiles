const {task} = require('gulp');

module.exports = function checkingChanges() {
    task('checking-changes', async (cb) => {
        const targetBranch = process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME;
        const diff =
            this.execNativeShellSync(`git diff origin/${targetBranch} HEAD package-lock.json | wc -c | xargs`);

        if (!+diff) {
            console.error(
                '-'.repeat(55) +
                '\n\nPackage-lock does not match, please rebase the branch.\n\n' +
                '-'.repeat(55),
            );
            process.exit(1);
        }

        cb();
    });
};
