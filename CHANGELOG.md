# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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

