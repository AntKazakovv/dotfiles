const {task, src, dest} = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-dart-sass');
const fs = require('fs');

const config = {
    mode: 'production',
    output: {
        filename: 'inline.js',
        pathinfo: false,
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.inline.json',
                },
            },
        ],
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js',
        ],
    },
    optimization: {
        minimize: true,
    },
};

module.exports = function inlineTask() {

    task('build:loader-css', (cb) => {
        this.addToGitIgnore('/roots/static', 'css', 'app.loader.scss');
        return src(`${this.params.paths.src}/app-styles/app.loader.scss`)
            .pipe(sass({outputStyle: 'compressed', sync: true}).on('error', sass.logError))
            .pipe(dest(`${this.params.paths.static}/css/`));
    });

    task('build:hosted-fields-css', (cb) => {
        this.addToGitIgnore('/roots/static', 'css', 'hosted.fields.css');
        return src(`${this.params.paths.src}/app-styles/hosted.fields.scss`)
            .pipe(sass({outputStyle: 'compressed', sync: true}).on('error', sass.logError))
            .pipe(dest(`${this.params.paths.static}/css/`));
    });

    task('build:inline', (cb) => {
        return src(`${this.params.paths.inline}/index.ts`)
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
};
