const path = require('path');
const appVersion = require('../package.json').version;
const packageName = require('../package.json').name;
const versionHelper = require('./versionHelper');

versionHelper.createSdkVersionFile(
    path.join(__dirname + '/../lib/sdk-info.generated.ts'),
    appVersion,
    packageName,
    '.'
);