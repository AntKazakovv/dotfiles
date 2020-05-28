const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: {
        preload: './wlc-engine/src/inline/preload.ts',
    },
    output: {
        path: fs.realpathSync('./roots/static/dist'),
        // filename: 'inline.[name].[chunkhash].js',
        filename: 'inline.[name].js',
        publicPath: '/static/dist/',
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
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['inline.*']
        }),
        // new HtmlWebpackPlugin({
        //     template: fs.realpathSync('./roots/static/dist/index.html'),
        //     minify: false,
        //     inject: false,
        //     chunks: ['preload']
        // }),
    ]
};

module.exports = config;
