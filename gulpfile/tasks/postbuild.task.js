const {task} = require('gulp');

function postBuildTask() {
    task('build:sw-fix', async (cb) => {
        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });
        await this.execShell('npm run sw-fix', false, {
            killOthers: ['success', 'failure'],
            raw: true
        });
        cb();
    });
}
postBuildTask.order = 70;
module.exports = postBuildTask;
