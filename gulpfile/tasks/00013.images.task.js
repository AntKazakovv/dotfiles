const {task, src, series} = require('gulp');
const size = require('gulp-size');
const through2 = require('through2');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function filterBySize(limit) {
    return through2.obj(function(file, _, cb) {
        if (file.stat
            && limit * 1024 <= file.stat.size) {
            this.push(file);
        }

        cb();
    });
};

module.exports = function images() {
    task('check-all-images', () => {
        return src([
            `${this.params.paths.images.all}/**/*`,
        ])
            .pipe(filterBySize(this.params.limits.allImages))
            .pipe(size({
                showFiles: true,
                showTotal: false,
                title: `image size is more than ${this.params.limits.allImages}kb`,
            }));
    });

    task('check-thumb-images', () => {
        return src([
            `${this.params.paths.images.gamesThumb}/**/*`,
        ])
            .pipe(filterBySize(this.params.limits.thumbImages))
            .pipe(size({
                showFiles: true,
                showTotal: false,
                title: `in the games_thumb folder image size is more than ${this.params.limits.thumbImages}kb`,
            }));
    });

    task('check-all-svg', () => {
        return src([
            `${this.params.paths.images.all}/**/*.svg`,
        ])
            .pipe(filterBySize(this.params.limits.allSvg))
            .pipe(size({
                showFiles: true,
                showTotal: false,
                title: `svg-image size is more than ${this.params.limits.allSvg}kb`,
            }));
    });

    task('images', series(
        'check-all-images',
        'check-all-svg',
        'check-thumb-images',
    ));
};
