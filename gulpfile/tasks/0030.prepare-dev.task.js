const {task} = require('gulp'),
    fs = require('fs');

module.exports = function buildTask() {
    task('prepare:dev', (cb) => {
        this.dev = true;

        // const realEnginePath = `${this.params.paths.engineDev}`;
        // if (fs.existsSync(realEnginePath)) {
        //     try {
        //         fs.unlinkSync(this.params.paths.engine);
        //     } catch (e) {
        //         this.deleteFolderRecursive(this.params.paths.engine);
        //     }
        //     fs.symlinkSync('../../../wlc-engine', this.params.paths.engine);
        // }

        cb();
    });
}
