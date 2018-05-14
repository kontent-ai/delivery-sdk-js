import { sdkInfo } from '../lib/sdk-info.generated';

const versionInPackage = require('../package.json').version;

if (sdkInfo.version !== versionInPackage) {
    throw Error('Versions of SDK don\'t match. Lib version is \'' + sdkInfo.version + '\' while package version is \'' + versionInPackage + '\'. Please make sure to use identical versions.');
} else {
    console.log('Version check successful for \'' + sdkInfo.version + '\'');
}
