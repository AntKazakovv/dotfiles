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

        if (this.params.paths.youtubeBlockDev) {

            const realPathYoutube = `${this.params.paths.youtubeBlockDev}`;

            if (fs.existsSync(realPathYoutube)) {
                try {
                    fs.unlinkSync(this.params.paths.youtubeBlockLink);
                } catch (e) {
                    this.deleteFolderRecursive(this.params.paths.youtubeBlockLink);
                }
                fs.symlinkSync('../wlc-youtube-block', this.params.paths.youtubeBlockLink);
            }
        }

        cb();
    });
}
