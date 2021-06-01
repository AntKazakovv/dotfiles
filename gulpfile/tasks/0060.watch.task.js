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

        // eslint-disable-next-line no-console
        console.log(series('watch:inline')());

        const watcher = watch(
            watchList,
            {
                delay: 200,
            },
            series('liveReload:reload'),
        );

        cb();
    };

    const watchForPreloader = () => {
        watch(`${this.params.paths.src}/app-styles/app.loader.scss`).on('change',  () => {
            series('build:loader-css', 'liveReload:reload')();
        });
    };

    const watchForHostedFields = () => {
        watch(`${this.params.paths.src}/app-styles/hosted.fields.scss`).on('change',  () => {
            series('build:hosted-fields-css', 'liveReload:reload')();
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
        parallel(['build:hosted-fields-css', 'build:loader-css'])();

        watchForPreloader();
        watchForHostedFields();

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
