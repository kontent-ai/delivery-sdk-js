# Kentico Cloud

This repository contains TypeScript packages related to [Kentico Cloud](https://kenticocloud.com/) app development.

# SDKs Overview

## [Delivery SDK](https://github.com/Kentico/KenticoCloudDeliveryTypeScriptSDK/tree/master/packages/delivery)

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Build Status](https://api.travis-ci.org/Kentico/kentico-cloud-js.svg?branch=master)](https://travis-ci.org/Kentico/kentico-cloud-js)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-delivery.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kentico-cloud-js/badge.svg)](https://snyk.io/test/github/Kentico/kentico-cloud-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kentico-cloud-js.svg)](https://github.com/Kentico/kentico-cloud-js)
![Gzip browser bundle](http://img.badgesize.io/https://unpkg.com/kentico-cloud-delivery@latest/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js?compression=gzip)

Delivery JavaScript/TypeScript SDK is an official client library used for retrieving content from Kentico Cloud. Both browser and Node.js integrations are supported.

* [Quickstart](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery)
* [Full documentation](https://github.com/Kentico/kentico-cloud-js/blob/master/doc/delivery.md)
* [Example apps](https://github.com/Kentico/kentico-cloud-js/tree/master/examples)

## [Model generator for Delivery SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/model-generator)

[![npm version](https://badge.fury.io/js/kentico-cloud-model-generator-utility.svg)](https://www.npmjs.com/package/kentico-cloud-model-generator-utility)
[![Build Status](https://api.travis-ci.org/Kentico/kentico-cloud-js.svg?branch=master)](https://travis-ci.org/Kentico/kentico-cloud-js)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-model-generator-utility.svg)](https://www.npmjs.com/package/kentico-cloud-model-generator-utility)

A utility for generating strongly-typed models based on Content Types in a Kentico Cloud project.

* [Documentation](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/model-generator)
* [Tutorial](https://developer.kenticocloud.com/docs/strongly-typed-models)

### Bugs & new features

Create a [new GitHub issue](https://github.com/Kentico/kentico-cloud-js/issues/new).

### Developing packages

This github repository contains multiple packages (it is a `monorepo`) and is managed with the help of `lerna`. In order to start developing this library, you need to:

- Clone this repository
- Install lerna globally using `npm i lerna -g`
- Prepare all packages by running `npm run prepare` script in the root repository. This script bootstraps all packages, builds them and bootstraps again so that symlinking local packages works correctly when local version of package is referenced instead of the one published on npm.

To publish this library you can use standard `npm publish` command after increasing package versions. Some packages in this repository (delivery, content management sdks) require you to also run `npm run set-sdk-version` script which takes the package name & version from package.json and creates a static file called `sdk-info.generated.ts` with sdk information which is used to identify sdk calls. 

Packages will not let you publish new versions unless the version in `package.json` & `sdk-info.generates.ts` matches.

### Feedback & Contribution

Feedback & Contributions are welcome. Feel free to start an issue and submit a pull request.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/kentico-cloud-js?pixel)
