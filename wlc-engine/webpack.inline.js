const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const config = {
    entry: {
        bootstrap: './wlc-engine/src/inline/bootstrap.ts',
    },
    output: {
        path: fs.realpathSync('./roots/static/dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
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

module.exports = config;
