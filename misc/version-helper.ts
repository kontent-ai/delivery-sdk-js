import { writeFileSync } from 'fs';
import { yellow, red, green, cyan } from 'colors';
import { ISDKInfo } from '@kontent-ai/core-sdk';

export const verifySdkVersion = (sdkInfo: ISDKInfo, versionInPackage: string) => {
    if (sdkInfo.version !== versionInPackage) {
        const msg = `Versions of '${sdkInfo.name}' SDK don't match. Lib version is '${sdkInfo.version}' while package version is '${versionInPackage}'. 
        Please make sure to use identical versions.`;
        throw Error(red(msg));
    } else {
        console.log(
            `Version check successful for '$.yellow(sdkInfo.version)}' and package '$.yellow(
                sdkInfo.name
            )}'`
        );
    }
};

export const createSdkVersionFile = (filePath: string, appVersion: string, packageName: string, importFrom: string) => {
    console.log(cyan('\nCreating SDK version file'));

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
    console.log(green(`Updating application version ${yellow(appVersion)}`));
    console.log(`${green('Writing version module to ')}${yellow(filePath)}\n`);
};
