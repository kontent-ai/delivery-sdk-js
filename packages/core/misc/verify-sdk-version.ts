import { sdkInfo } from '../lib/sdk-info.generated';
declare function require(name: string): any;

const versionHelper = require('./versionHelper');
const appVersion = require('../package.json').version;

versionHelper.verifySdkVersion(sdkInfo, appVersion);
