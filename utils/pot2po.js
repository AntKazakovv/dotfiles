const fs = require('fs');
const exec = require('child_process').exec;
const async = require('async');

function potToPo() {

    const path = fs.realpathSync('./projects/wlc-engine/src/');
    const locales = require(path +'/locales.json');
    const pot = path + '/languages/messages.pot';

    const commands = Object.keys(locales).map((locale) => {
        const poFilePath = `${path}/languages/${locale}.po`;
        const localeCmds = [];
        if (fs.existsSync(poFilePath)) {
            localeCmds.push(`msgmerge --force-po --no-fuzzy-matching --update --backup=off --lang=${locale} ` +
                `${poFilePath} ${pot} \n`);
                localeCmds.push(`sed -i 's/#~ //g' ${poFilePath}\n`);
        } else {
            localeCmds.push(`msgcat --force-po --lang=${locale} ${pot} > ${poFilePath}\n`);
        }
        return localeCmds;
    }).reduce((acc, cmds) => {
        return acc.concat(cmds);
    }).map(command => {
        return function() {
            exec(command);
        }
    });

    async.waterfall(commands);
}

potToPo();