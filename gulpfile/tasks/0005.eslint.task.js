const {task} = require('gulp');

module.exports = function eslintTask() {
    task('eslint', async (cb) => {
        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });

        await this.execShell('npm run lint', false, {
            killOthers: ['success', 'failure'],
            raw: true,
        });
        cb();
    })
}
