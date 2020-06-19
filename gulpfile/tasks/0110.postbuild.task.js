const {task} = require('gulp');

module.exports = function postBuildTask() {
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
};
