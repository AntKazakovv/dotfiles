module.exports = class WlcWatchExtFilesPlugin {
    constructor(paths = []) {
        this.paths = paths;
    }

    apply(compiler) {
        compiler.hooks.afterCompile.tapAsync('WlcWatchExtFilesPlugin', (compilation, callback) => {
            this.paths.forEach((path) => {
                compilation.contextDependencies.add(path);
            });

            callback();
        });
    }
};
