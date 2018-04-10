const path = require('path');
const colors = require('colors/safe');
const fs = require('fs');
const appVersion = require('../package.json').version;
const packageId = require('../package.json').name;

console.log(colors.cyan('\nRunning pre-build tasks'));

const versionFilePath = path.join(__dirname + '/../lib/sdk-version.js');

const src = `
exports.version = '${appVersion}';
exports.packageId = '${packageId}';
exports.repoHost = 'npmjs.com';
`;

// ensure version module pulls value from package.json
fs.writeFile(versionFilePath, src, { flat: 'w' }, function (err) {
    if (err) {
        return console.log(colors.red(err));
    }

    console.log(colors.green(`Updating application version ${colors.yellow(appVersion)}`));
    console.log(`${colors.green('Writing version module to ')}${colors.yellow(versionFilePath)}\n`);
});