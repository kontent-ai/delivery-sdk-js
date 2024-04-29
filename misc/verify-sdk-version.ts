import { sdkInfo } from '../lib/sdk-info.generated';
import { version } from '../package.json';
import { verifySdkVersion } from './version-helper';

verifySdkVersion(sdkInfo, version);
