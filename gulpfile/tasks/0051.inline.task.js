const {task, src, dest} = require('gulp');
const webpack = require('webpack-stream');
const wp = require('webpack');
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

    task('build:loader-css', () => {
        this.addToGitIgnore('/roots/static', 'css', 'app.loader.scss');
        return src(`${this.params.paths.src}/app-styles/app.loader.scss`)
            .pipe(sass({outputStyle: 'compressed', sync: true}).on('error', sass.logError))
            .pipe(dest(`${this.params.paths.static}/css/`));
    });

    task('build:hosted-fields-css', () => {
        this.addToGitIgnore('/roots/static', 'css', 'hosted.fields*.css');
        return src(`${this.params.paths.src}/app-styles/hosted.fields*.scss`)
            .pipe(sass({outputStyle: 'compressed', sync: true}).on('error', sass.logError))
            .pipe(dest(`${this.params.paths.static}/css/`));
    });

    task('build:piq-cashier-css', () => {
        this.addToGitIgnore('/roots/static', 'css', 'piq.cashier*.css');
        return src(`${this.params.paths.src}/app-styles/piq.cashier*.scss`)
            .pipe(sass({outputStyle: 'compressed', sync: true}).on('error', sass.logError))
            .pipe(dest(`${this.params.paths.static}/css/`));
    });

    task('build:inline', (cb) => {
        this.addToGitIgnore('/roots', 'template', 'inline.js');
        return src(`${this.params.paths.inline}/index.ts`)
            .pipe(webpack(config, wp))
            .pipe(dest(`${this.params.paths.root}/roots/template/`));
    });

    task('watch:inline', (cb) => {
        this.addToGitIgnore('/roots', 'template', 'inline.js');
        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });
        return src(`${this.params.paths.inline}/index.ts`)
            .pipe(webpack(Object.assign({}, config, {mode: 'development', watch: true}), wp))
            .pipe(dest(`${this.params.paths.root}/roots/template/`));
    });
};
