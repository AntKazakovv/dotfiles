const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const createDir = require('make-dir');
const _includes = require('lodash/includes');

const customPath = '/src/custom/';

class WlcTemplateReplacePlugins {
    static styles = new webpack.NormalModuleReplacementPlugin(/\.scss?.+$/i, (resource) => {

        const originStylePath = path.resolve(
            resource.context,
            resource.request.replace(/\?.+$/, ''),
        );

        if (!originStylePath || !_includes(originStylePath, '/wlc-engine/modules/') || /^_/.test(originStylePath)) {
            return;
        }

        const customStylePath = originStylePath.replace('/wlc-engine/', customPath);
        const customStyleDir = path.dirname(customStylePath);
        const styleName = path.basename(customStylePath);

        if (fs.existsSync(customStylePath)) {
            resource.request = customStylePath;
        } else {
            createDir.sync(customStyleDir);
            const fileData =
                '// Set custom variables before @import \n\n'
                + `@import '${originStylePath.replace(/^.*wlc-engine\//i, 'wlc-engine/')}'; \n\n`
                + '// Component\'s custom styles';

            fs.writeFileSync(customStyleDir + '/~' + styleName, fileData);
        }
    });

    static templates = new webpack.NormalModuleReplacementPlugin(/\.html?.+$/i, (resource) => {
        const originTplPath = path.resolve(
            resource.context,
            resource.request.replace(/\?.+$/, ''),
        ).replace('!raw-loader!./', '');

        if (!originTplPath || !_includes(originTplPath, '/wlc-engine/modules/')) {
            return;
        }

        const customTplPath = originTplPath.replace('/wlc-engine/', customPath);
        const customComponentDir = path.dirname(customTplPath).replace('!raw-loader!./', '');
        const tplName = path.basename(customTplPath).replace('!raw-loader!./', '');
        const tsName = tplName.replace('.html', '.ts');
        const originTsPath = originTplPath.replace('.html', '.ts');

        if (fs.existsSync(customTplPath)) {
            resource.request = resource.request.replace(/.+\?/, customTplPath + '?');
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
    });
}

module.exports = WlcTemplateReplacePlugins;
