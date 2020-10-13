import * as webpack from 'webpack';
import * as fs from 'fs';
import * as path from 'path';
import * as createDir from 'make-dir';

import {
    includes as _includes,
} from 'lodash';

export default (config) => {

    config.plugins.push(new webpack.NormalModuleReplacementPlugin(/\.scss$/i, (resource) => {
        const originStylePath = resource.resource;

        if (!originStylePath || !_includes(originStylePath, '/wlc-engine/modules/') || /^_/.test(originStylePath)) {
            return;
        }

        const customStylePath: string = originStylePath.replace('/wlc-engine/', '/custom/');
        const customStyleDir: string = path.dirname(customStylePath);
        const styleName: string = path.basename(customStylePath);


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

        const customTplPath: string = originTplPath.replace('/wlc-engine/', '/custom/');
        const customComponentDir: string = path.dirname(customTplPath);
        const tplName: string = path.basename(customTplPath);
        const tsName: string = tplName.replace(/\.html$/i, '.ts');
        const originTsPath: string = originTplPath.replace(/\.html$/i, '.ts');

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

