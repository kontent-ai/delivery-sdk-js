const lb = require('../lib/sdk-version.js');
const libVersion = lb.version;
const versionInPackage = require('../package.json').version;

if (libVersion != versionInPackage) {
    throw Error('Versions of SDK don\'t match. Lib version is \'' + libVersion +'\' while package version is \'' + versionInPackage + '\'. Please make sure to use identical versions.');
} else {
    console.log('Version check successful for \'' + libVersion + '\'');
}
