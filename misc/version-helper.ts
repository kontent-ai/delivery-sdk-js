import { writeFileSync } from 'fs';
import Colors from 'colors';

export const verifySdkVersion = (sdkInfo, versionInPackage) => {
    if (sdkInfo.version !== versionInPackage) {
        const msg = `Versions of '${sdkInfo.name}' SDK don't match. Lib version is '${sdkInfo.version}' while package version is '${versionInPackage}'. 
        Please make sure to use identical versions.`;
        throw Error(Colors.red(msg));
    } else {
        console.log(
            `Version check successful for '${Colors.yellow(sdkInfo.version)}' and package '${Colors.yellow(
                sdkInfo.name
            )}'`
        );
    }
};

export const createSdkVersionFile = (filePath, appVersion, packageName, importFrom) => {
    console.log(Colors.cyan('\nCreating SDK version file'));

    const src = `
import { ISDKInfo } from '${importFrom}';
export const sdkInfo: ISDKInfo = {
    host: 'npmjs.com',
    version: '${appVersion}',
    name: '${packageName}'
};
`;

    // ensure version module pulls value from package.json
    writeFileSync(filePath, src);
    console.log(Colors.green(`Updating application version ${Colors.yellow(appVersion)}`));
    console.log(`${Colors.green('Writing version module to ')}${Colors.yellow(filePath)}\n`);
};
