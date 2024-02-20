const {resolve} = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CSSMQPackerPlugin = require('css-mqpacker-webpack-plugin');

const WlcTemplateReplacePlugins = require('./wlcTemplateReplacePlugins');
const WlcStructureInfoPlugin = require('./wlcStructureInfoPlugin');
const WlcStaticImagePlugin = require('./wlcStaticImagePlugin');
const WlcWatchExtFilesPlugin = require('./wlcWatchExtFilesPlugin');
const sortMqList = require('./wlcMqSortingPlugin');


module.exports = (config, schema, env) => {
    const isDev = env.configuration === 'dev';

    config.resolveLoader = {
        alias: {
            'custom-components-loader': resolve(__dirname, './custom-files-loader.js'),
        },
    };

    config.module.rules.push({
        test: /(.*)\/components\/(.*)\.component\.ts$/,
        loader: 'custom-components-loader',
        exclude: /node_modules/,
    });

    config.plugins.push(new StylelintPlugin({
        lintDirtyModulesOnly: true,
        cache: true,
        failOnError: false,
    }));

    config.plugins.push(new WlcStaticImagePlugin({
        outputFile: 'src/staticImagesList',
    }));

    config.plugins.push(WlcTemplateReplacePlugins.styles);

    config.plugins.push(WlcTemplateReplacePlugins.templates);

    config.plugins.push(new CSSMQPackerPlugin({
        sort: sortMqList,
    }));

    if (isDev) {
        config.plugins.push(new WlcStructureInfoPlugin());
        config.plugins.push(new WlcWatchExtFilesPlugin([
            resolve('roots/static/images'),
            resolve('src/custom'),
        ]));
    }

    return config;
};
