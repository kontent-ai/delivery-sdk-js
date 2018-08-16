const colors = require('colors/safe');
const fs = require('fs');

exports.verifySdkVersion = (sdkInfo, versionInPackage) => {
    if (sdkInfo.version !== versionInPackage) {
        const msg = 'Versions of \'' + sdkInfo.name + '\' SDK don\'t match. Lib version is \'' + sdkInfo.version + '\' while package version is \'' + versionInPackage + '\'. Please make sure to use identical versions.';
        throw Error(colors.red(msg));
    } else {
        console.log(colors.green('Version check successful for \'' + sdkInfo.version + '\' and package \'' + sdkInfo.name + '\''));
    }
}

exports.createSdkVersionFile = (filePath, appVersion, packageName, importFrom) => {

    console.log(colors.cyan('\nCreating SDK version file'));

    const src = `
import { ISDKInfo } from '${importFrom}';
export const sdkInfo: ISDKInfo = {
    host: 'npmjs.com',
    version: '${appVersion}',
    name: '${packageName}'
};
`;

    // ensure version module pulls value from package.json
    fs.writeFile(filePath, src, { flat: 'w' }, function (err) {
        if (err) {
            return console.log(colors.red(err));
        }

        console.log(colors.green(`Updating application version ${colors.yellow(appVersion)}`));
        console.log(`${colors.green('Writing version module to ')}${colors.yellow(filePath)}\n`);
    });
}


