const {task, series, parallel} = require('gulp');

module.exports = function buildTask() {
    task('build:prepare', series(
        parallel(
            'clean:temp',
            'clean:dist',
        ),
        'prepare:build',
    ));

    task('engineBuild:prepare', series(
        parallel(
            'clean:temp',
            'clean:dist',
        ),
        'enginePrepare:build',
        parallel(
            'engineMessages',
        ),
    ));

    task('build:dev', async (cb) => {
        const platform = this.parseProcessParams(process.argv)['platform'];
        const configuration = this.getConfiguration() || 'dev';

        let command = 'npm run build:dev';

        if (this.params.isMobileAppBundle) {
            command = `npm run build:${configuration === 'prod' ? 'prod-dev' : configuration}`;

            if (platform) {
                command += ` --platform=${platform}`;
            }
        }

        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });

        await this.execShell(command, false, {
            killOthers: ['success', 'failure'],
            raw: true,
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
            raw: true,
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
            raw: true,
        });
        cb();
    });

    task('dev', series(
        'build:prepare',
        'prepare:dev',
        'build:symlinkHeadFile',
        'messages',
        parallel(
            'watch',
            'build:dev',
        ),
    ));

    task('dist', series(
        'build:prepare',
        'build:prod',
        'messages',
        parallel(
            'build:inline',
            'build:sw-fix',
            'build:copyHeadFile',
            'build:modifyIndexFile',
            'build:loader-css',
            'build:piq-cashier-css',
            'build:hosted-fields-css',
        ),
    ));

    task('engineBuild', series(
        // 'scssLint',
        // 'eslint',
        // 'test',
        'engineBuild:prepare',
        'engineBuild:prod',
    ));


    /** :::::::::::::::::: CORDOVA :::::::::::::::::: */

    task('cordova:build:prepare', series(
        parallel(
            'clean:temp',
            'clean:dist',
        ),
        'prepare:cordova:build',
    ));

    task('cordovaBuild', series(
        'build:prepare',
        'build:prod',
        parallel(
            'build:inline',
            'build:sw-fix',
            'build:copyHeadFile',
            'build:modifyIndexFile',
            'build:loader-css',
            'build:hosted-fields-css',
        ),
    ));

    task('cordovaBuild:dev', series(
        'cordova:build:prepare',
        'cordova:build:inline',
        'prepare:dev',
        parallel(
            'watch',
            'build:dev',
        ),
    ));
};
