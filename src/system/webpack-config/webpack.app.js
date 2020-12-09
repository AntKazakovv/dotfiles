const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const WlcTemplateReplacePlugins = require('./wlcTemplateReplacePlugins');
const WlcStructureInfoPlugin = require('./wlcStructureInfoPlugin');
const WlcStaticImagePlugin = require('./wlcStaticImagePlugin');
const WlcWatchExtFilesPlugin = require('./wlcWatchExtFilesPlugin');

module.exports = (config, schema, env) => {
    const isDev = env.configuration === 'dev';

    Object.assign(config.stats, {
        errorDetails: false,
        chunks: false,
        chunkModules: false,
        children: false,
        reasons: false,
        hash: false,
        moduleAssets: false,
        assets: false,
        logging: false,
        moduleTrace: false,
        warnings: false,
        errors: false,
        entrypoints: false,
        version: false,
        timings: true,
    });

    const progressPlugin = config.plugins.find(plugin => plugin.constructor.name === 'ProgressPlugin');

    progressPlugin && Object.assign(progressPlugin, {
        profile: false,
    });

    config.plugins.push(new ESLintPlugin({
        files: [
            'src/**/*.{ts,js}',
            'config/frontend/**/*.{ts,js}',
            'wlc-engine/**/*.{ts,js}',
        ],
        lintDirtyModulesOnly: true,
        failOnError: false,
    }));

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

    if(isDev) {
        config.plugins.push(new WlcStructureInfoPlugin());
        config.plugins.push(new WlcWatchExtFilesPlugin([
            'roots/static/images',
            'src/custom',
        ]));
    }

    return config;
};
