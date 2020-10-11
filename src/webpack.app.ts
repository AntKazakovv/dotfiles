import * as webpack from 'webpack';
import * as fs from 'fs';
import * as path from 'path';
import * as WlcWpPlugin from './wlc-wp-plugin.js';
import * as createFile from 'create-file';
import * as createDir from 'make-dir';

import {
    includes as _includes
} from 'lodash';

export default (config, options, targetOptions) => {

    // config.module.rules.push({
    //     test: /\.html$/,
    //     use: [
    //         {
    //             loader: path.resolve(__dirname, 'wlc-loader.js'),
    //             options: {}
    //         }
    //     ]
    // });

    config.plugins.push(new webpack.NormalModuleReplacementPlugin(/\.(html|ts|scss)$/, (resource) => {
        if (!resource.resource) {
            return;
        }

        const excludeFiles = [
            'index',
            'module',
            'interface'
        ];

        const fileName = path.basename(resource.resource);
        for (let substr of excludeFiles) {
            if (_includes(fileName, substr)) {
                return;
            }
        }

        if (_includes(resource.resource, '/wlc-engine/modules/')) {
            const customFile: string = resource.resource.replace('/wlc-engine/', '/custom/');
            const customFileDir: string = path.dirname(customFile);
            const customTmpFile: string = customFileDir + '/~' + path.basename(customFile);

            if (fs.existsSync(customFile)) {
                resource.resource = customFile;
            } else {
                createDir.sync(customFileDir);
                fs.copyFileSync(resource.resource, customTmpFile);
            }
        }
    }));
    return config;
};

