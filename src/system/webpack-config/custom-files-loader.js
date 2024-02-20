const fs = require('fs');
const path = require('path');
const createDir = require('make-dir');

const componentRegEx = /(.*)\/components\/(.*)\.component\.ts$/i;

module.exports = function(content) {

    if (!this.resourcePath.match(componentRegEx)) {
        return content;
    }

    const customPath = path.resolve(
        this.resourcePath.replace(/wlc-engine/i, 'src/custom'),
    );

    const tsName = path.basename(this.resourcePath);
    const customDirName = path.dirname(customPath);

    if (fs.existsSync(customPath)) {
        const customContent = fs.readFileSync(customPath);
        this.addDependency(customPath);
        this.addContextDependency(customPath);
        this.resourcePath = customPath;
        return customContent;
    } else {
        try {
            if (!fs.existsSync(customDirName)) {
                createDir.sync(customDirName);
            }
            fs.copyFileSync(this.resourcePath, customDirName + '/~' + tsName);
        } catch (error) {
            console.error('Cannot create ts file for ' + tsName);
        }
    }

    return content;
};
