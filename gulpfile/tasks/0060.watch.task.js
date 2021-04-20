const {watch, series, task, dest, src} = require('gulp');
const liveReload = require('gulp-livereload'), fs = require('fs'), sass = require('gulp-dart-sass');

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

    const createSitePreloader = () => {
        fs.access(`${this.params.paths.src}/app-styles/app.loader.scss`, (err) => {
            if (err) {
                fs.writeFileSync(`${this.params.paths.src}/app-styles/app.loader.scss`,
                    `@import 'wlc-engine/engine-scss/_engine.loader.scss';\n`);
            }

            compileLoaderStyles();
        });
    };

    const compileLoaderStyles = () => {
        src(`${this.params.paths.src}/app-styles/app.loader.scss`)
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(dest(`${this.params.paths.static}/css/`));
    };

    const watchForPreloader = () => {
        watch(`${this.params.paths.src}/app-styles/app.loader.scss`).on('change',  () => compileLoaderStyles());
    };

    task('liveReload:reload', (cb) => {
        liveReload.reload();
        cb();
    });

    task('watch', (cb) => {
        if (this.params.isEngineBundle) {
            return;
        }

        createSitePreloader();
        watchForPreloader();

        this.execShell(
            'LRPID=$(fuser -vn tcp 35729 | awk \'{print $1}\'); if [ $LRPID ]; then kill -9 $LRPID; fi',
            true,
        ).then(() => {
            liveReload.listen({
                port: process.env.LIVERELOAD || 35729,
            });

            distDirectoryWatcher(cb);
        });

    });
};
