const {task} = require('gulp');

module.exports = function testsTask() {
    task('test', async (cb) => {
        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });

        await this.execShell('npm run test', false, {
            killOthers: ['success', 'failure'],
            raw: true,
        });
        cb();
    })
}
