const {task} = require('gulp'),
    fs = require('fs');

module.exports = function cleanTask() {
    task('clean:temp', (cb) => {
        this.deleteFolderRecursive(this.params.paths.temp);
        fs.mkdirSync(this.params.paths.temp);
        cb();
    });

    task('clean:dist', (cb) => {
        this.deleteFolderRecursive(this.params.paths.dist);
        fs.mkdirSync(this.params.paths.dist);
        cb();
    });
};
