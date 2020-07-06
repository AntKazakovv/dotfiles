const {task} = require('gulp'),
    fs = require('fs');

module.exports = function buildTask() {
    task('prepare:dev', (cb) => {
        this.dev = true;

        const realEnginePath = `${this.params.paths.engineDev}`;
        if (fs.existsSync(realEnginePath)) {
            try {
                fs.unlinkSync(this.params.paths.engineLink);
            } catch (e) {
                this.deleteFolderRecursive(this.params.paths.engineLink);
            }
            fs.symlinkSync('../wlc-engine/src', this.params.paths.engineLink);
        }

        cb();
    });
}
