const {task} = require('gulp'),
    fs = require('fs');

module.exports = function preBuildTask() {
    task('prepare:build', (cb) => {
        makeDistDirectory();
        makeTempDirectory();
        makeIndexHtmlSymlink();
        makeWlcEngineSymlink();

        cb();
    });

    // Create Dist directory
    const makeDistDirectory = () => {
        if (!fs.existsSync(this.params.paths.dist)) {
            fs.mkdirSync(this.params.paths.dist);
        }
    }

    // Create Temp directory
    const makeTempDirectory = () => {
        if (!fs.existsSync(this.params.paths.temp)) {
            fs.mkdirSync(this.params.paths.temp);
        }
    }

    // Create symlink to the index.html file in the dist directory
    const makeIndexHtmlSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.indexFile);
        } catch {
            if (!fs.existsSync(this.params.paths.indexFile)) {
                fs.symlinkSync('../static/dist/index.html', this.params.paths.indexFile);
            }
        }
    }

    // Create symlink to the index.html file in the src directory
    const makeSrcIndexHtmlSymlink = () => {
        if (fs.existsSync(this.params.paths.srcIndexFile)) {
            return;
        }
        try {
            fs.lstatSync(this.params.paths.srcIndexFile);
        } catch {
            fs.symlinkSync('../wlc-engine/index.html', this.params.paths.srcIndexFile);
        }
    }

    // Create symlink to the wlc-engine directory
    const makeWlcEngineSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.engineLink);
            fs.unlinkSync(this.params.paths.engineLink);
        } catch {
            //
        }
        fs.symlinkSync('./node_modules/@egamings/wlc-engine/src', this.params.paths.engineLink);
    }

    // Create symlink to the polyfills.ts file in the src directory
    const makePolyfillsSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.polyfillsFile);
            fs.unlinkSync(this.params.paths.polyfillsFile);
        } catch {
            //
        }
        fs.symlinkSync('../wlc-engine/polyfills.ts', this.params.paths.polyfillsFile);
    }

    task('prepare:build', (cb) => {
        makeDistDirectory();
        makeTempDirectory();
        makeIndexHtmlSymlink();
        makeWlcEngineSymlink();
        makeSrcIndexHtmlSymlink();
        makePolyfillsSymlink();

        cb();
    });

    task('enginePrepare:build', (cb) => {
        makeDistDirectory();
        makeTempDirectory();

        cb();
    });
}
