const {task, series, parallel} = require('gulp');

module.exports = function buildTask() {
    task('build:prepare', series(
        parallel(
            'clean:temp',
            'clean:dist',
        ),
        'prepare:build',
        parallel(
            //'messages'
        ),
    ));

    task('engineBuild:prepare', series(
        parallel(
            'clean:temp',
            'clean:dist',
        ),
        'enginePrepare:build',
        parallel(
            'engineMessages'
        ),
    ));


    task('build:dev', async (cb) => {
        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });
        await this.execShell('npm run build:dev', false, {
            killOthers: ['success', 'failure'],
            raw: true
        });
        cb();
    });

    task('build:prod', async (cb) => {
        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });
        await this.execShell('npm run build:prod', false, {
            killOthers: ['success', 'failure'],
            raw: true
        });
        cb();
    });

    task('engineBuild:prod', async (cb) => {
        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });
        await this.execShell('npm run build', false, {
            killOthers: ['success', 'failure'],
            raw: true
        });
        cb();
    });

    task('dev', series(
        'build:prepare',
        'prepare:dev',
        parallel(
            'watch',
            'build:dev',
        ),
    ));

    task('dist', series(
        'build:prepare',
        'build:prod',
        parallel(
            'build:inline',
            'build:sw-fix'
        )
    ));

    task('engineBuild', series(
        'scssLint',
        'eslint',
        // 'test',
        'engineBuild:prepare',
        'engineBuild:prod'
    ));
}
