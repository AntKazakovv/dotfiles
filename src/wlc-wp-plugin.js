module.exports = class WlcWpPlugin {
    constructor(opts) {
        this.options = opts || {};
    }

    apply(compiler) {
        compiler.hooks.beforeRun.tapAsync('WlcWpPlugin', (compiler, cb) => {
            console.dir(compiler);
            process.exit(0);
            cb();
        });
    }
};
