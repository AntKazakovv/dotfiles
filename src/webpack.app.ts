import * as webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';
import * as WlcWpPlugin from './wlc-wp-plugin.js';

function findCustomFile(filePath: string): string {
    const customFilePath = filePath.replace('/wlc-engine/', '/custom/');

    try {
        if (fs.existsSync(customFilePath)) {
            return customFilePath;
        }
    } catch (err) {
        return null;
    }
    return null;
}

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

    // config.plugins.push(new WlcWpPlugin());
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(/\.html$/, (resource) => {
        if (resource.resource) {
            const customFilePath = findCustomFile(resource.resource);
            if (customFilePath) {
                console.dir(customFilePath);
                // console.dir(resource);
                resource.request = customFilePath;
            }

        }

    }));
    // console.dir(options);
    return config;
};

