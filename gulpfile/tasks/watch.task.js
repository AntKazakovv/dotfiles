const {watch, series, task} = require('gulp');
const liveReload = require('gulp-livereload');

function watchTask() {

    const watchList = [
        `${this.params.paths.dist}/*`,
    ];

    const distDirectoryWatcher = (cb) => {
        const watcher = watch([this.params.paths.static]);
        watcher.on('change', (path, stats) => {
            distWatcher(cb);
            watcher.close();
        });
    };

    const distWatcher = (cb) => {

        console.log(series('watch:inline')());

        const watcher = watch(
            watchList,
            {
                delay: 200
            },
            series('liveReload:reload')
        );

        cb();
    };

    task('liveReload:reload', (cb) => {
        liveReload.reload();
        cb();
    });

    task('watch', (cb) => {
        if(this.params.isEngineBundle) {
            return
        }

        this.execShell(
            'LRPID=$(fuser -vn tcp 35729 | awk \'{print $1}\'); if [ $LRPID ]; then kill -9 $LRPID; fi',
            true
        ).then(() => {
            liveReload.listen({
                port: process.env.LIVERELOAD || 35729
            });

            distDirectoryWatcher(cb);
        });

    });
}

watchTask.order = 60;
module.exports = watchTask;
