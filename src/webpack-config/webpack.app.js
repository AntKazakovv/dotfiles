const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const createDir = require('make-dir');

const _includes = require('lodash/includes');

module.exports = (config) => {

    config.plugins.push(new webpack.NormalModuleReplacementPlugin(/\.scss$/i, (resource) => {
        const originStylePath = resource.resource;

        if (!originStylePath || !_includes(originStylePath, '/wlc-engine/modules/') || /^_/.test(originStylePath)) {
            return;
        }

        const customStylePath = originStylePath.replace('/wlc-engine/', '/custom/');
        const customStyleDir = path.dirname(customStylePath);
        const styleName = path.basename(customStylePath);


        if (fs.existsSync(customStylePath)) {
            resource.resource = customStylePath;
        } else {
            createDir.sync(customStyleDir);
            fs.writeFileSync(customStyleDir + '/~' + styleName, '');
        }
    }));

    config.plugins.push(new webpack.NormalModuleReplacementPlugin(/\.html$/i, (resource) => {
        const originTplPath = resource.resource;

        if (!originTplPath || !_includes(originTplPath, '/wlc-engine/modules/')) {
            return;
        }

        const customTplPath = originTplPath.replace('/wlc-engine/', '/custom/');
        const customComponentDir = path.dirname(customTplPath);
        const tplName = path.basename(customTplPath);
        const tsName = tplName.replace('.html', '.ts');
        const originTsPath = originTplPath.replace('.html', '.ts');

        if (fs.existsSync(customTplPath)) {
            resource.resource = customTplPath;
        } else {
            createDir.sync(customComponentDir);
            fs.copyFileSync(originTplPath, customComponentDir + '/~' + tplName);
        }

        // Just for IDE support
        try {
            fs.copyFileSync(originTsPath, customComponentDir + '/~readonly_' + tsName);
        } catch (e) {
            console.error('Cannot create readonly ts file for ' + tplName);
        }
    }));

    return config;
};

