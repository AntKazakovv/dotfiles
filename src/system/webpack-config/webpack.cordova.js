const {resolve} = require('path');
const execSync = require('child_process').execSync;
const CSSMQPackerPlugin = require('css-mqpacker-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

const WlcTemplateReplacePlugins = require('./wlcTemplateReplacePlugins');
const WlcStructureInfoPlugin = require('./wlcStructureInfoPlugin');
const WlcStaticImagePlugin = require('./wlcStaticImagePlugin');
const WlcWatchExtFilesPlugin = require('./wlcWatchExtFilesPlugin');
const WlcRunCordovaPlugin = require('./wlcRunCordovaPlugin');
const sortMqList = require('./wlcMqSortingPlugin');

const parseProcessParams = (params) => {
    if (params && params.length > 2) {
        params = params.slice(2);
        return params.reduce((acc, item) => {
            const parsed = item.match(/(?<=--).+?(?=\=)|(?<=\=).+?$/gi);
            if (parsed && parsed.length === 2) {
                acc[parsed[0]] = parsed[1];
            }
            return acc;
        }, {});
    } else {
        return {};
    }
};

const execNativeShellSync = (command) => {
    var response = execSync(command);
    return response.toString('UTF8');
};

const getMobileAppApiUrl = (rootDir) => {
    let configuration = parseProcessParams(process.argv)['configuration'];
    if (!configuration) return;

    if (configuration === 'prod-dev') {
        configuration = 'prod';
    }

    const code = 'const window: any = {}; import {environment} from "' + rootDir + '/src/environments/environment.' + configuration + '"; console.log(environment.mobileApp.apiUrl)';

    let result = execNativeShellSync(`npx ts-node -e '${code}' --skip-project --transpile-only`).trim();

    if (result.indexOf('http') === 0) {

        if (result.endsWith('/')) {
            result = result.substr(0, result.length - 1);
        }
        return result;
    }
};

module.exports = (config, schema, env) => {
    const isDev = env.configuration === 'dev';
    const platforms = ['android', 'ios', 'browser'];
    const apiUrl = getMobileAppApiUrl(config.context);

    if (apiUrl) {
        config.plugins.push(new ReplaceInFileWebpackPlugin([
            {
                dir: 'www',
                test: /.*\.css$/,
                rules: [
                    {
                        search: /\/gstatic/g,
                        replace: apiUrl + '/gstatic',
                    },
                    {
                        search: /\/static/g,
                        replace: apiUrl + '/static',
                    },
                    {
                        search: /\/app-static/g,
                        replace: '/static',
                    },
                ],
            },
            {
                dir: 'www',
                test: /.*\.js$/,
                rules: [
                    {
                        search: /url\(\\"\/gstatic/g,
                        replace: 'url(\\"' + apiUrl + '/gstatic',
                    },
                    {
                        search: /url\(\\"\/static/g,
                        replace: 'url(\\"' + apiUrl + '/static',
                    },
                    // {
                    //     search: /url\(\\"\/app-static/g,
                    //     replace: 'url(\\"/static',
                    // },
                    // {
                    //     search: /\/app-static/g,
                    //     replace: '/static',
                    // },
                ],
            }
        ]));
    }

    config.plugins.push(new StylelintPlugin({
        lintDirtyModulesOnly: true,
        cache: true,
        failOnError: false,
    }));

    config.plugins.push(new WlcStaticImagePlugin({
        outputFile: 'src/staticImagesList',
        sourceDir: 'static/images',
    }));

    config.plugins.push(WlcTemplateReplacePlugins.styles);

    config.plugins.push(WlcTemplateReplacePlugins.templates);

    config.plugins.push(new CSSMQPackerPlugin({
        sort: sortMqList,
    }));

    if (isDev) {
        config.plugins.push(new WlcStructureInfoPlugin());
        config.plugins.push(new WlcWatchExtFilesPlugin([
            resolve('src/images'),
            resolve('src/custom'),
        ]));
    }

    config.plugins.push(new CopyWebpackPlugin({
        patterns: [
            {
                from: '**/*',
                to: 'static',
                force: true,
                context: 'static'
            },
        ]
    }));

    let platform = process.env.npm_config_platform;
    if (!platform) {
        throw Error('Error on get "process.env.npm_config_platform"');
    }

    if (platforms.includes(platform)) {
        config.plugins.push(new WlcRunCordovaPlugin({platform: platform}));
    } else if (platform) {
        console.error(`Wrong platform option: ${platform} \n Platform must be 'android', 'ios' or 'browser'`)
    }

    return config;
};
