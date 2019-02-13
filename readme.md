# Kentico Cloud Javascript

> Repository hosting several javascript packages and SDKs related to the awesome [Kentico Cloud](https://kenticocloud.com/) API ecosystem.

## [Delivery Javascript SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery)

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Build Status](https://api.travis-ci.org/Kentico/kentico-cloud-js.svg?branch=master)](https://travis-ci.org/Kentico/kentico-cloud-js)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-delivery.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kentico-cloud-js/badge.svg)](https://snyk.io/test/github/Kentico/kentico-cloud-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kentico-cloud-js.svg)](https://github.com/Kentico/kentico-cloud-js)
![Gzip browser bundle](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/kentico-cloud-delivery/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js?compression=gzip)

A client library for retrieving data from [Kentico Cloud](https://kenticocloud.com/) using [Delivery API](https://developer.kenticocloud.com/v1/reference#delivery-api). Works both in `node.js` and `browsers`.

* [Quickstart](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery)
* [Full documentation](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery/DOCS.md)
* [Example apps](https://github.com/Kentico/kentico-cloud-js/tree/master/examples)
* [API Reference](https://kentico.github.io/kentico-cloud-js/delivery/)

## [Content Management Javascript SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/content-management)

Javascript SDK for the [Kentico Cloud Content Management API](https://developer.kenticocloud.com/v1/reference#content-management-api-v2). Helps you manage content in your [Kentico Cloud](https://kenticocloud.com/) projects. Work both in `node.js` and `browsers`.

[![npm version](https://badge.fury.io/js/kentico-cloud-content-management.svg)](https://www.npmjs.com/package/kentico-cloud-content-management)
[![Build Status](https://api.travis-ci.org/Kentico/kentico-cloud-js.svg?branch=master)](https://travis-ci.org/Kentico/kentico-cloud-js)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-content-management.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kentico-cloud-js/badge.svg)](https://snyk.io/test/github/kentico/kentico-cloud-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kentico-cloud-js.svg)](https://github.com/Kentico/kentico-cloud-js)
![Gzip bundle](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/kentico-cloud-content-management/_bundles/kentico-cloud-cm-sdk.umd.min.js?compression=gzip)

* [Quickstart](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/content-management)
* [Examples](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/content-management/demo)
* [API Reference](https://kentico.github.io/kentico-cloud-js/content-management/)

## [Javascript model generator for Delivery SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/model-generator)

[![npm version](https://badge.fury.io/js/kentico-cloud-model-generator-utility.svg)](https://www.npmjs.com/package/kentico-cloud-model-generator-utility)
[![Build Status](https://api.travis-ci.org/Kentico/kentico-cloud-js.svg?branch=master)](https://travis-ci.org/Kentico/kentico-cloud-js)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-model-generator-utility.svg)](https://www.npmjs.com/package/kentico-cloud-model-generator-utility)

A utility for generating strongly-typed models based on Content Types in a Kentico Cloud project.

* [Documentation](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/model-generator)
* [Tutorial](https://developer.kenticocloud.com/docs/strongly-typed-models)

## Developer's guide

This github repository is a `monorepo` and is managed using `lerna`. In order to start developing this library, you need to:

- Clone this repository
- Install lerna globally using `npm i lerna -g`
- Prepare all packages by running `npm run prepare` script in the main directory. This script bootstraps all dependencies, builds libraries and symlinks local packages if necessary.

### Publishing

To publish this library you can use standard `npm publish` command after increasing package versions. Some packages in this repository (delivery, content management sdks) require you to also run `npm run set-sdk-version` script which takes the package name & version from package.json and creates a updats file called `sdk-info.generated.ts` that is further used to identify source of package during HTTP calls.

Packages will not let you publish new versions unless the version in `package.json` & `sdk-info.generates.ts` matches.

### Generating changelog details

Repository uses `lerna-changelog` for generating `changelog` details. All PRs that should appear in changelog have to be tagged by one of the following labels:

- `breaking` (:boom: Breaking Change)
- `enhancement` (:rocket: Enhancement)
- `bug` (:bug: Bug Fix)
- `documentation` (:memo: Documentation)
- `internal` (:house: Internal)

Changelog is generated with `lerna-changelog --from {tag}` command. By specifying`{tag}`, you filter only PRs merged since tag was released.

### Feedback & Contribution

Contributions are welcomed. If you have an idea of what you would like to implement, let us know and lets discuss details of your PR.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/kentico-cloud-js?pixel)
