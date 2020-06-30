const {watch, series, task, src, dest} = require('gulp');
const webpack = require('webpack-stream');
const fs = require('fs');

const config = {
    mode: 'production',
    output: {
        filename: 'inline.js',
        pathinfo: false
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.inline.json'
                }
            }
        ]
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js'
        ]
    }
};

module.exports = function inlineTask() {
    task('build:inline', (cb) => {
        return src(`${this.params.paths.inline}/*.ts`)
            .pipe(webpack(config))
            .pipe(dest(this.params.paths.dist));
    });

    task('watch:inline', async (cb) => {
        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });
        await src(`${this.params.paths.inline}/*.ts`)
            .pipe(webpack(Object.assign({}, config, {mode: 'development', watch: true})))
            .pipe(dest(this.params.paths.dist));
        cb();
    });
}
