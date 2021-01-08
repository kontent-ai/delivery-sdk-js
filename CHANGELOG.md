# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [10.2.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v10.1.0...v10.2.0) (2021-01-08)


### Features

* updates dependencies ([651ccb4](https://github.com/Kentico/kontent-delivery-sdk-js/commit/651ccb44626c2542bf1caee83fc31ee4fd0b53a5))


### Bug Fixes

* updates internal types of parse5 parser adapter ([83109f7](https://github.com/Kentico/kontent-delivery-sdk-js/commit/83109f73003e233938c753d6795899f1b55e8ce4))

## [10.1.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v10.0.0...v10.1.0) (2020-11-26)


### Features

* adds support for collections
* updates all dependencies, uses axios models directly for request interceptors ([5aa5f8b](https://github.com/Kentico/kontent-delivery-sdk-js/commit/5aa5f8b4529ecfb8c3a9763db3755a36fa385267))

## [10.0.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v9.2.1...v10.0.0) (2020-08-25)


### ⚠ BREAKING CHANGES

* Refactors IQueryParameter to allows value-less parameters which are required by new filtering operators (empty / nempty), adds support for new filter options (fixes https://github.com/Kentico/kontent-delivery-sdk-js/issues/297)

### Features

* Refactors IQueryParameter to allows value-less parameters which are required by new filtering operators (empty / nempty), adds support for new filter options (fixes https://github.com/Kentico/kontent-delivery-sdk-js/issues/297) ([b2ae46f](https://github.com/Kentico/kontent-delivery-sdk-js/commit/b2ae46f615c6db7465125e09f8527fcfd49084a2))


### Bug Fixes

* fixes url resolving test for node.js ([212d343](https://github.com/Kentico/kontent-delivery-sdk-js/commit/212d34355104eb0201a3768d2bd198fc4b537176))

### [9.2.1](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v9.2.0...v9.2.1) (2020-08-11)


### Bug Fixes

* fixes automatic format for image transformation api (fixes https://github.com/Kentico/kontent-delivery-sdk-js/issues/296) ([42204ff](https://github.com/Kentico/kontent-delivery-sdk-js/commit/42204ff31a5f7cdbfcb684cb724ca6f24298f36c))

## [9.2.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v9.1.1...v9.2.0) (2020-07-30)


### Features

* updates dependencies, moves error handling logic from core package to sdk + fixes error mapping after recent error response change which now allows null in request_id property ([a11e745](https://github.com/Kentico/kontent-delivery-sdk-js/commit/a11e745d4148ac93dafa038f09bd6cd3b6b41a35))


### Bug Fixes

* improves handling of image resolving in rich text element and fixes parse5 parsing in nested component rich text resolver (https://github.com/Kentico/kontent-delivery-sdk-js/issues/294) ([9b82718](https://github.com/Kentico/kontent-delivery-sdk-js/commit/9b82718220c6affe62dfe8b79380323858db9e71))

### [9.1.1](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v9.1.0...v9.1.1) (2020-04-02)


### Bug Fixes

* fixes missing attributes in parse5 resolved links with custom html ([2e2f8c1](https://github.com/Kentico/kontent-delivery-sdk-js/commit/2e2f8c1d1c92d15395a0bfb646c32781ae06fdbf))

## [9.1.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v9.0.0...v9.1.0) (2020-03-26)


### Features

* exposes richTextParserAdapter via config ([62659a6](https://github.com/Kentico/kontent-delivery-sdk-js/commit/62659a688661b5e786b853e7dd0e59aac2eeb02c))


### Bug Fixes

* fixes https://github.com/Kentico/kontent-delivery-sdk-js/issues/286 & unifies parse5 / browser tests ([2a787f4](https://github.com/Kentico/kontent-delivery-sdk-js/commit/2a787f4ec237528a55ae3df7676ed348cf502e87))

## [9.0.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v8.2.0...v9.0.0) (2020-01-20)


### ⚠ BREAKING CHANGES

* updates deps, refactors retry-strategy which enables specifying either maximum number of attemps or wait time and allows retry of any error even when response is not received (e.g. timeout which could not be retried previously)

### Features

* distributes library in esNext format ([bd9ea6f](https://github.com/Kentico/kontent-delivery-sdk-js/commit/bd9ea6f5f7dd81277d59c8a85e9952bde0ed74f6))
* refactors item mappers and adds full mapping support to items-feed endpoints (e.g. rich text resolver, url slug resolver, image resolver ..) ([6e30485](https://github.com/Kentico/kontent-delivery-sdk-js/commit/6e304856fda0a7d9c55e2910dac2578014cedc37))
* updates deps, refactors retry-strategy which enables specifying either maximum number of attemps or wait time and allows retry of any error even when response is not received (e.g. timeout which could not be retried previously) ([b7cf414](https://github.com/Kentico/kontent-delivery-sdk-js/commit/b7cf414bc2da0f4fc42368fd5ab44a555bf36afc))

## [8.2.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v8.1.0...v8.2.0) (2019-11-25)


### Features

* adds helper method to return linked items as array (fixes https://github.com/Kentico/kontent-delivery-sdk-js/issues/240) ([b832f7b](https://github.com/Kentico/kontent-delivery-sdk-js/commit/b832f7b67c85fce0d80e763a2207afb859855fc8))
* extends ContentItem with ability to get all elements in an array (fixes https://github.com/Kentico/kontent-delivery-sdk-js/issues/241) ([120918b](https://github.com/Kentico/kontent-delivery-sdk-js/commit/120918bc9d724efd765cf320e676bbd56a6f9fa4))
* updates all dependencies (including dev depencies such as the use of latest TypeScript..) ([62a9ffc](https://github.com/Kentico/kontent-delivery-sdk-js/commit/62a9ffc1b8ead493b6adc891fbb9bd05ed629070))


### Bug Fixes

* fixes github repo url in package.json & fixes changelog links (fixes https://github.com/Kentico/kontent-delivery-sdk-js/issues/268) ([a4132e7](https://github.com/Kentico/kontent-delivery-sdk-js/commit/a4132e7d95a6c99ade17c487b68721fb0bafc58c))

## [8.1.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v8.0.0...v8.1.0) (2019-11-18)


### Features

* adds support for 'includeTotalCount| parameter ([c39a301](https://github.com/Kentico/kontent-delivery-sdk-js/commit/c39a301bf73c72b4e87db071a4293c7f45ef0c8e))


### Bug Fixes

* updates kontent-core package which fixes http retry requests ([53a4318](https://github.com/Kentico/kontent-delivery-sdk-js/commit/53a43184a708c0c36fbe611d99a6298f24ad097a))

## [8.0.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v7.2.0...v8.0.0) (2019-10-25)


### ⚠ BREAKING CHANGES

* Updates @kentico/kontent-core to v4 and uses new and improved retry strategy. 'retryAttempts' configuration option was removed in favor of 'retryStrategy' object.

### Features

* adds 'itemsFeedAll' method to get all items from a project. This method may execute multiple HTTP requests. Reworks base responses & debug to allow different debug types per response. ([72e03fd](https://github.com/Kentico/kontent-delivery-sdk-js/commit/72e03fd3587573d82d665e0010c696e122e73248))
* adds support for 'items-feed' endpoint ([29913c9](https://github.com/Kentico/kontent-delivery-sdk-js/commit/29913c984b073166a8f0ddc12f69106c7d476efd))
* Updates @kentico/kontent-core to v4 and uses new and improved retry strategy. 'retryAttempts' configuration option was removed in favor of 'retryStrategy' object. ([e2abd02](https://github.com/Kentico/kontent-delivery-sdk-js/commit/e2abd02a233f78f9c9152397f5eb915d73ba1189))


### Bug Fixes

* prepares instances of all items before resolving occurs to prevent some items from being skipped ([5559cb6](https://github.com/Kentico/kontent-delivery-sdk-js/commit/5559cb608668f608f759256f0a35486fb7397d9c))

## [7.2.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v7.1.0...v7.2.0) (2019-10-21)


### Features

* Enables resolving links without content item representation in response ([6472265](https://github.com/Kentico/kontent-delivery-sdk-js/commit/6472265867d8b6dc200ff756032a75a848b0d92c))
* takes 'isDeveloperMode' settings into account when displaying root debug element (https://github.com/Kentico/kontent-delivery-sdk-js/issues/255] ([7ab56cb](https://github.com/Kentico/kontent-delivery-sdk-js/commit/7ab56cb64703e7481ea02433ad5aca95bd9b8b51))
* updates @kentico/kontent-core dependency which enables configuring axios request (https://github.com/Kentico/kontent-delivery-sdk-js/issues/256) ([ea3a504](https://github.com/Kentico/kontent-delivery-sdk-js/commit/ea3a504e3a2eb37a06d40daf5a40ea11dfbe517f))

## 7.1.0 (2019-10-14)

## [7.1.0](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v7.0.1...v7.1.0) (2019-10-14)

### Features

* adds hasStaleContent property to all responses and uses new BaseDeliveryResponse base class ([3dc5046](https://github.com/Kentico/kontent-delivery-sdk-js/commit/3dc50463a70a3f70e3f0920ed11758f62efdb236))

### [7.0.1](https://github.com/Kentico/kontent-delivery-sdk-js/compare/v1.1.0...v7.0.1) (2019-10-14)

