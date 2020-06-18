const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: {
        gulpfile: './gulpfile.ts',
    },
    output: {
        path: fs.realpathSync('./'),
        // filename: 'inline.[name].[chunkhash].js',
        filename: 'gulpfile.js',
        // publicPath: '/static/dist/',
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.gulpfile.json'
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
    },
    plugins: [
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns: ['inline.*']
        // }),
        // new HtmlWebpackPlugin({
        //     template: fs.realpathSync('./roots/static/dist/index.html'),
        //     minify: false,
        //     inject: false,
        //     chunks: ['preload']
        // }),
    ]
};

module.exports = config;
