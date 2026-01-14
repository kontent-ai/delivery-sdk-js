import { version, name } from '../package.json';
import { createSdkVersionFile } from './version-helper';

createSdkVersionFile('./lib/sdk-info.generated.ts', version, name, '@kontent-ai/core-sdk');
