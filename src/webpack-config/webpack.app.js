const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const eslintConfig = require('../../.eslintrc.js');
const stylelintConfig = require('../../stylelint.config.js');
const WlcTemplateReplacePlugins = require('./wlcTemplateReplacePlugins');
const WlcStructureInfoPlugin = require('./wlcStructureInfoPlugin');

module.exports = (config, schema, env) => {
    const isDev = env.configuration === 'dev';

    config.plugins.push(new ESLintPlugin({
        config: eslintConfig,
        files: [
            'src/**/*.{ts,js}',
            'config/frontend/**/*.{ts,js}',
            'wlc-engine/**/*.{ts,js}',
        ],
        lintDirtyModulesOnly: true,
        failOnError: false,
    }));

    config.plugins.push(new StylelintPlugin({
        config: stylelintConfig,
        lintDirtyModulesOnly: true,
        cache: true,
        failOnError: false,
    }));

    config.plugins.push(WlcTemplateReplacePlugins.styles);

    config.plugins.push(WlcTemplateReplacePlugins.templates);

    if(isDev) {
        config.plugins.push(new WlcStructureInfoPlugin());
    }

    return config;
};

