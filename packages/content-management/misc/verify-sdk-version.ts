import { sdkInfo } from '../lib/sdk-info.generated';
import { verifySdkVersion } from '../../core/misc/versionHelper';
declare function require(name: string);

const appVersion = require('../package.json').version;

verifySdkVersion(sdkInfo, appVersion);
