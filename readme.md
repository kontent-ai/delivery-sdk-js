# Kentico Kontent Javascript

> Repository hosting several javascript packages and SDKs related to the awesome [Kentico Kontent](https://kontent.ai/) API ecosystem.

## [Delivery Javascript SDK](https://github.com/Kentico/kentico-kontent-js/tree/master/packages/delivery)

[![npm version](https://badge.fury.io/js/%40kentico%2Fkontent-delivery.svg)](https://badge.fury.io/js/%40kentico%2Fkontent-delivery)
[![Build Status](https://api.travis-ci.com/Kentico/kentico-kontent-js.svg?branch=master)](https://travis-ci.com/Kentico/kentico-kontent-js)
[![CircleCI](https://circleci.com/gh/Kentico/kentico-kontent-js/tree/master.svg?style=svg)](https://circleci.com/gh/Kentico/kentico-kontent-js/tree/master)
[![npm](https://img.shields.io/npm/dt/@kentico/kontent-delivery.svg)](https://www.npmjs.com/package/@kentico/kontent-delivery)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-kontent)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kentico-kontent-js/badge.svg)](https://snyk.io/test/github/Kentico/kentico-kontent-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kentico-kontent-js.svg)](https://github.com/Kentico/kentico-kontent-js)
![Gzip browser bundle](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/_bundles/kontent-delivery.browser.umd.min.js?compression=gzip)
[![](https://data.jsdelivr.com/v1/package/npm/@kentico/kontent-delivery/badge)](https://www.jsdelivr.com/package/npm/@kentico/kontent-delivery)

A client library for retrieving data from [Kentico Kontent](https://kontent.ai/) using [Delivery API](https://developer.kenticocloud.com/v1/reference#delivery-api). Works both in `node.js` and `browsers`.

* [Quickstart](https://github.com/Kentico/kentico-kontent-js/tree/master/packages/delivery)
* [Full documentation](https://github.com/Kentico/kentico-kontent-js/tree/master/packages/delivery/DOCS.md)
* [Example apps](https://github.com/Kentico/kentico-kontent-js/tree/master/examples)
* [Changelog](https://github.com/Kentico/kentico-kontent-js/blob/master/packages/delivery/CHANGELOG.md)
* [Upgrade guide](https://github.com/Kentico/kentico-kontent-js/blob/master/packages/delivery/UPGRADE.md)

## [Content Management Javascript SDK](https://github.com/Kentico/kentico-kontent-js/tree/master/packages/management)

Javascript SDK for the [Kontent Management API](https://developer.kenticocloud.com/v1/reference#content-management-api-v2). Helps you manage content in your [Kentico Kontent](https://kontent.ai/) projects. Work both in `node.js` and `browsers`.

[![npm version](https://badge.fury.io/js/%40kentico%2Fkontent-management.svg)](https://badge.fury.io/js/%40kentico%2Fkontent-management)
[![Build Status](https://api.travis-ci.com/Kentico/kentico-kontent-js.svg?branch=master)](https://travis-ci.com/Kentico/kentico-kontent-js)
[![CircleCI](https://circleci.com/gh/Kentico/kentico-kontent-js/tree/master.svg?style=svg)](https://circleci.com/gh/Kentico/kentico-kontent-js/tree/master)
[![npm](https://img.shields.io/npm/dt/@kentico/kontent-management.svg)](https://www.npmjs.com/package/@kentico/kontent-delivery)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-kontent)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kentico-kontent-js/badge.svg)](https://snyk.io/test/github/kentico/kentico-kontent-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kentico-kontent-js.svg)](https://github.com/Kentico/kentico-kontent-js)
![Gzip bundle](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/@kentico/kontent-management/_bundles/kontent-management.umd.min.js?compression=gzip)
[![](https://data.jsdelivr.com/v1/package/npm/@kentico/kontent-management/badge)](https://www.jsdelivr.com/package/npm/@kentico/kontent-management)


* [Quickstart](https://github.com/Kentico/kentico-kontent-js/tree/master/packages/management)
* [Examples](https://github.com/Kentico/kentico-kontent-js/tree/master/packages/management/demo)
* [Changelog](https://github.com/Kentico/kentico-kontent-js/blob/master/packages/management/CHANGELOG.md)

## [Javascript model generator for Delivery SDK](https://github.com/Kentico/kentico-kontent-js/tree/master/packages/model-generator)

[![npm version](https://badge.fury.io/js/%40kentico%2Fkontent-model-generator.svg)](https://badge.fury.io/js/%40kentico%2Fkontent-model-generator)
[![Build Status](https://api.travis-ci.com/Kentico/kentico-kontent-js.svg?branch=master)](https://travis-ci.com/Kentico/kentico-kontent-js)
[![npm](https://img.shields.io/npm/dt/@kentico/kontent-model-generator.svg)](https://www.npmjs.com/package/@kentico/kontent-model-generator)

A utility for generating strongly-typed models based on Content Types in a Kentico Kontent project.

* [Documentation](https://github.com/Kentico/kentico-kontent-js/tree/master/packages/model-generator)
* [Tutorial](https://developer.kenticocloud.com/docs/strongly-typed-models)
* [Changelog](https://github.com/Kentico/kentico-kontent-js/blob/master/packages/model-generator/CHANGELOG.md)

## Developer's guide

This github repository is a `monorepo` and is managed using `lerna`. In order to start developing this library, you need to:

- Clone this repository
- Install lerna globally using `npm i lerna -g`
- Prepare all packages by running `npm run prepare` script in the main directory. This script bootstraps all dependencies, builds libraries and symlinks local packages if necessary.

### Publish checklist

To publish new version of most packages in this repository, use following checklist:

1) Run `npm run new-minor` or `npm run new-patch` or `npm run new-major` and commit changes
2) Publish to npm using `npm publish` script. This script verifies package version, builds library and tests it before publishing.
3) Run `lerna-changelog --from  {previousTag}` to generate changelog and copy relevant changes to `ChANGELOG.md` file of appropriate package. 
4) Create new tag in following format `package-folder@version` such as `delivery@5.6.0` or `content-management@1.0.5`. See [git versions](https://github.com/Kentico/kentico-kontent-js/releases) for more examples.
5) Commit & push all changes

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

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/kentico-kontent-js?pixel)
