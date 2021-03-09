// const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const WlcTemplateReplacePlugins = require('./wlcTemplateReplacePlugins');
const WlcStructureInfoPlugin = require('./wlcStructureInfoPlugin');
const WlcStaticImagePlugin = require('./wlcStaticImagePlugin');
const WlcWatchExtFilesPlugin = require('./wlcWatchExtFilesPlugin');

module.exports = (config, schema, env) => {
    const isDev = env.configuration === 'dev';

    const dedupeModuleResolvePlugin = config.plugins.find(plugin => plugin.constructor.name === 'DedupeModuleResolvePlugin');

    dedupeModuleResolvePlugin && Object.assign(dedupeModuleResolvePlugin.options, {
        verbose: false,
    });

    // config.plugins.push(new ESLintPlugin({
    //     files: [
    //         'src/**/*.{ts,js}',
    //         'config/frontend/**/*.{ts,js}',
    //         'wlc-engine/**/*.{ts,js}',
    //     ],
    //     baseConfig: require('../../../.eslintrc.js'),
    //     lintDirtyModulesOnly: true,
    //     threads: true,
    //     cache: true,
    //     failOnError: false,
    // }));

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

    if (isDev) {
        config.plugins.push(new WlcStructureInfoPlugin());
        config.plugins.push(new WlcWatchExtFilesPlugin([
            'roots/static/images',
            'src/custom',
        ]));
    }

    const scssRules = config.module.rules.filter((item) => item.test.exec('.scss'));

    scssRules.forEach(rule => {
        const postcss = rule.use.find((item) => item.loader && item.loader.includes('postcss'));
        postcss.options = {
            postcssOptions: {
                ident: 'embedded',
                sourceMap: 'inline',
                plugins: [
                    require('css-mqpacker')({sort: true}),
                ],
            },
        };
    });

    return config;
};
