const fs = require('fs');

const path = fs.realpathSync('./node_modules/jasmine/package.json');

const file = fs.readFileSync(path).toString();
const json = JSON.parse(file);
delete json.exports;

fs.writeFileSync(path, JSON.stringify(json, null, 4));
