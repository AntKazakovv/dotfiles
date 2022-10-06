const {watch, series, task, parallel} = require('gulp');
const liveReload = require('gulp-livereload');
const fs = require('fs');

module.exports = function watchTask() {

    const watchList = [
        `${this.params.paths.dist}/*`,
        `!${this.params.paths.dist}/*.map`,
    ];

    const distDirectoryWatcher = (cb) => {
        const watcher = watch([this.params.paths.static]);
        watcher.on('change', (path, stats) => {
            distWatcher(cb);
            watcher.close();
        });
    };

    const distWatcher = (cb) => {

        if (this.params.isMobileAppBundle) {
            /** :::::::::::::::::: CORDOVA :::::::::::::::::: */
            // eslint-disable-next-line no-console
            console.log(series('cordova:watch:inline')());
        } else {
            // eslint-disable-next-line no-console
            console.log(series('watch:inline')());
        }

        const watcher = watch(
            watchList,
            {
                delay: 200,
            },
            series('build:modifyIndexFile', 'liveReload:reload'),
        );

        cb();
    };

    const watchForMobileAppLoader = () => {
        watch(`${this.params.paths.src}/app-styles/mobile-app.loader.scss`).on('change',  () => {
            series('mobile-app:build:loader-css', 'liveReload:reload')();
        });
    };

    const watchForMobileAppForbidden = () => {
        watch(`${this.params.paths.src}/app-styles/mobile-app.forbidden.scss`).on('change',  () => {
            series('mobile-app:build:offline-css', 'liveReload:reload')();
        });
    };

    const watchForMobileAppOffline = () => {
        watch(`${this.params.paths.src}/app-styles/mobile-app.offline.scss`).on('change',  () => {
            series('mobile-app:build:forbidden-css', 'liveReload:reload')();
        });
    };

    const watchForPreloader = () => {
        watch(`${this.params.paths.src}/app-styles/app.loader.scss`).on('change',  () => {
            series('build:loader-css', 'liveReload:reload')();
        });
    };

    const watchForHostedFields = () => {
        watch(`${this.params.paths.src}/app-styles/hosted.fields*.scss`).on('change',  () => {
            series('build:hosted-fields-css', 'liveReload:reload')();
        });
    };

    const watchForPiqCashier = () => {
        watch(`${this.params.paths.src}/app-styles/piq.cashier*.scss`).on('change',  () => {
            series('build:piq-cashier-css', 'liveReload:reload')();
        });
    };

    task('liveReload:reload', (cb) => {
        liveReload.reload();
        cb();
    });

    task('watch', (cb) => {
        if (this.params.isEngineBundle) {
            return;
        }

        const tasks = [
            'build:hosted-fields-css',
            'build:piq-cashier-css'
        ];

        if (this.params.isMobileAppBundle) {
            tasks.push('mobile-app:build:loader-css');
            tasks.push('mobile-app:build:forbidden-css');
            tasks.push('mobile-app:build:offline-css');
        } else {
            tasks.push('build:loader-css');
        }

        parallel(tasks)();


        if (this.params.isMobileAppBundle) {
            watchForMobileAppLoader();
            watchForMobileAppForbidden();
            watchForMobileAppOffline();
        } else {
            watchForPreloader();
        }

        watchForHostedFields();
        watchForPiqCashier();

        const liveReloadCommand = process.platform === 'darwin' ?
            'lsof -P | grep \':35729\' | awk \'{print $2}\' | xargs kill -9' :
            'LRPID=$(fuser -vn tcp 35729 | awk \'{print $1}\'); if [ $LRPID ]; then kill -9 $LRPID; fi';

        this.execShell(
            liveReloadCommand,
            true,
        ).then(() => {
            liveReload.listen({
                port: process.env.LIVERELOAD || 35729,
            });

            distDirectoryWatcher(cb);
        });

    });
};
