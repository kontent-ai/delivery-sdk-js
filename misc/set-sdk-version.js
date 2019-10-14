const path = require('path');
const appVersion = require('../package.json').version;
const packageName = require('../package.json').name;
const versionHelper = require('./version-helper');

versionHelper.createSdkVersionFile(
    path.join(__dirname + '/../lib/sdk-info.generated.ts'),
    appVersion,
    packageName,
    '@kentico/kontent-core'
);