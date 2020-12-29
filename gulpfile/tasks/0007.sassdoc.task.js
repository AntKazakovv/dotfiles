const {task, src, dest} = require('gulp'),
    sassdoc = require('sassdoc');

module.exports = function sassDocTask() {
    task('sassdoc', async () => {
        return src(`${this.params.paths.src}/**/*.scss`)
            .pipe(sassdoc(this.params.sassDocOptions));
    });
};
