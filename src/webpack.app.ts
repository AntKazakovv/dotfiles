import * as webpack from 'webpack';
import * as fs from 'fs';
import * as WlcWpPlugin from './wlc-wp-plugin.js';

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
        if (resource.resource && _includes(resource.resource, '/wlc-engine/modules/')) {
            const customFile: string = resource.resource.replace('/wlc-engine/', '/custom/');
            if (fs.existsSync(customFile)) {
                resource.resource = customFile;
            }
        }
    }));
    return config;
};

