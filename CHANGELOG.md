# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [12.0.1](https://github.com/kontent-ai/delivery-sdk-js/compare/v12.0.0...v12.0.1) (2022-07-15)


### Bug Fixes

* escapes property name regex to prevent unintended escaping caused by angular CLI ([0913986](https://github.com/kontent-ai/delivery-sdk-js/commit/0913986809a73fc09cda47a1acffe2352e3415cc))

## [12.0.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v12.0.0-0...v12.0.0) (2022-07-14)

## [12.0.0-0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.13.0...v12.0.0-0) (2022-07-14)

## [11.13.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.7.0...v11.13.0) (2022-05-23)


### Features

* Adds underscore to name resolver when it starts with a number ([5a624e3](https://github.com/kontent-ai/delivery-sdk-js/commit/5a624e3f59626f7b6c6bb94b9730f1c3edf2f721))
* Automatically removes zero width characters from name resolvers ([fbf07aa](https://github.com/kontent-ai/delivery-sdk-js/commit/fbf07aab776050ba006d1bc8a8d562679ce2dcfe))
* convert snake case name resolver to lowercase only text ([df39537](https://github.com/kontent-ai/delivery-sdk-js/commit/df395375f679a893b2d29b5409c4a0a3c2e6576d))
* Handles '&' in property name resolver ([e82ae6d](https://github.com/kontent-ai/delivery-sdk-js/commit/e82ae6d82662fda9786d26b6cebc6480fb95bc98))
* Handles brackets in property name resolver ([946db34](https://github.com/kontent-ai/delivery-sdk-js/commit/946db349de6a4add3a614e44daaab17720281011))
* Improves property name resolvers by handling more special characters and unifies the regex across all name resolvers ([d153e81](https://github.com/kontent-ai/delivery-sdk-js/commit/d153e81ff2d3114d31ae016bc9d8c3073571da94))
* updates dependencies ([5830491](https://github.com/kontent-ai/delivery-sdk-js/commit/5830491080767f22b49763051fda89c86f500b47))
* updates dependencies ([a373528](https://github.com/kontent-ai/delivery-sdk-js/commit/a373528b6f6167ebcf9b6c2e5395b1ba0d061bd2))


### Bug Fixes

* fixes property name resolver to cover cases with mixed upper/lower case strings ([66918c9](https://github.com/kontent-ai/delivery-sdk-js/commit/66918c99b6da2d94d7115baa581669ccb7fd048c))
* Properly sets query headers (some headers were not applied which caused issues especially in combination with paging) ([59af6c4](https://github.com/kontent-ai/delivery-sdk-js/commit/59af6c404846d71e52810813d837a8ea4c26c802))

## [11.12.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.11.0...v11.12.0) (2022-04-20)


### Features

* Handles '&' in property name resolver ([e82ae6d](https://github.com/kontent-ai/delivery-sdk-js/commit/e82ae6d82662fda9786d26b6cebc6480fb95bc98))

## [11.11.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.10.0...v11.11.0) (2022-04-20)


### Features

* convert snake case name resolver to lowercase only text ([df39537](https://github.com/kontent-ai/delivery-sdk-js/commit/df395375f679a893b2d29b5409c4a0a3c2e6576d))
* Handles brackets in property name resolver ([946db34](https://github.com/kontent-ai/delivery-sdk-js/commit/946db349de6a4add3a614e44daaab17720281011))

## [11.10.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.9.0...v11.10.0) (2022-04-20)


### Features

* Adds underscore to name resolver when it starts with a number ([5a624e3](https://github.com/kontent-ai/delivery-sdk-js/commit/5a624e3f59626f7b6c6bb94b9730f1c3edf2f721))

## [11.9.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.8.1...v11.9.0) (2022-04-20)


### Features

* Automatically removes zero width characters from name resolvers ([fbf07aa](https://github.com/kontent-ai/delivery-sdk-js/commit/fbf07aab776050ba006d1bc8a8d562679ce2dcfe))

### [11.8.1](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.8.0...v11.8.1) (2022-04-20)


### Bug Fixes

* fixes property name resolver to cover cases with mixed upper/lower case strings ([66918c9](https://github.com/kontent-ai/delivery-sdk-js/commit/66918c99b6da2d94d7115baa581669ccb7fd048c))

## [11.8.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.6.0...v11.8.0) (2022-04-20)


### Features

* Adds support for strongly typed taxonomy element ([c3d85ee](https://github.com/kontent-ai/delivery-sdk-js/commit/c3d85eecfd7fa3ced980d741195207596a3e44b8))
* Improves property name resolvers by handling more special characters and unifies the regex across all name resolvers ([d153e81](https://github.com/kontent-ai/delivery-sdk-js/commit/d153e81ff2d3114d31ae016bc9d8c3073571da94))
* updates dependencies ([a373528](https://github.com/kontent-ai/delivery-sdk-js/commit/a373528b6f6167ebcf9b6c2e5395b1ba0d061bd2))

## [11.7.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.5.0...v11.7.0) (2022-03-28)


### Features

* Adds support for strongly typed taxonomy element ([c3d85ee](https://github.com/kontent-ai/delivery-sdk-js/commit/c3d85eecfd7fa3ced980d741195207596a3e44b8))
* updates deps ([d899b0b](https://github.com/kontent-ai/delivery-sdk-js/commit/d899b0ba4eb4b52032657f6909eae1a833d2ec38))

## [11.6.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.5.0...v11.6.0) (2022-03-23)


### Features

* updates deps ([d899b0b](https://github.com/kontent-ai/delivery-sdk-js/commit/d899b0ba4eb4b52032657f6909eae1a833d2ec38))

## [11.5.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.5.0-1...v11.5.0) (2022-03-14)

## [11.5.0-1](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.5.0-0...v11.5.0-1) (2022-03-10)

## [11.5.0-0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.4.0...v11.5.0-0) (2022-03-07)


### Features

* Adds 'linkedItems' property to Rich text element that contains array or mapped linked items included in the element (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/338) ([9a48ae5](https://github.com/kontent-ai/delivery-sdk-js/commit/9a48ae53c1c2075a313207e6d7bba6a57c72d193))
* adds ability to preserve 'object' tags in RTE Html ([6034f89](https://github.com/kontent-ai/delivery-sdk-js/commit/6034f89da4a7df046e5c6d514780c96fa5ed228c))
* adds ability to set custom wrap tag for object & json Rich text resolvers (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/339) ([a6899ff](https://github.com/kontent-ai/delivery-sdk-js/commit/a6899ff06a7edb6256b3c7675d7a4ff635cefe7d))
* Removes 'object' wrapper tag from resolved Rich text element HTML (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/332) ([d9f9f74](https://github.com/kontent-ai/delivery-sdk-js/commit/d9f9f741f5bc7fbaec44c54c7703627af1b032b4))
* updates deps ( fixes https://github.com/kontent-ai/delivery-sdk-js/issues/342) ([517501e](https://github.com/kontent-ai/delivery-sdk-js/commit/517501e3228c59679adfbc22c42c9feb7f4e6904))

## [11.4.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.4.0-0...v11.4.0) (2022-02-04)


### Features

* updates deps ([dbb0474](https://github.com/kontent-ai/delivery-sdk-js/commit/dbb0474c551088257a71c7200d5ce2a28ea05a5a))
* adds ability to configure default asset rendition

## [11.3.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.3.0-0...v11.3.0) (2021-12-16)


### Features

* Adds support for custom asset domains (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/333) ([c8e70e4](https://github.com/kontent-ai/delivery-sdk-js/commit/c8e70e402a3b81fcdf965c68fd51842e39958bef))

### [11.2.1](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.2.1-0...v11.2.1) (2021-12-09)


### Bug Fixes

* use null instead of undefined for asset model properties ([da7ff46](https://github.com/kontent-ai/delivery-sdk-js/commit/da7ff461aad6dbf04c31dabdbcd4c9a11cdf743e))

## [11.2.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.2.0-0...v11.2.0) (2021-12-02)


### Features

* adds absolute url to rendition record ([a6a0ece](https://github.com/kontent-ai/delivery-sdk-js/commit/a6a0ece29e001fc4c892d54ca816bb75d494176a))

## [11.1.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.1.0-0...v11.1.0) (2021-11-29)


### Features

* updates dependencies ([b0b3ff5](https://github.com/kontent-ai/delivery-sdk-js/commit/b0b3ff564fd3d35691a2b9b92d6b3e6fb04fe5af))

## [11.0.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-11...v11.0.0) (2021-11-16)


### Features

* renames INetworkResponse interface to IDeliveryNetworkResponse ([e566537](https://github.com/kontent-ai/delivery-sdk-js/commit/e5665372563b485dc050ae1919910612b00c4bf2))
* updates deps ([42a6ff9](https://github.com/kontent-ai/delivery-sdk-js/commit/42a6ff9bbc070133f8f3e52f02c0f3e5d3cd9939))

## [11.0.0-11](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-10...v11.0.0-11) (2021-10-27)

## [11.0.0-10](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-9...v11.0.0-10) (2021-10-27)


### Features

* updates readme, creates base rich text resolvers and uses function to create each and every available resolver ([1cf140c](https://github.com/kontent-ai/delivery-sdk-js/commit/1cf140ce98074d2e590e5eefad5fed7fac3afe39))

## [11.0.0-9](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-8...v11.0.0-9) (2021-10-27)


### Features

* updates names rich text related async models ([231f4f6](https://github.com/kontent-ai/delivery-sdk-js/commit/231f4f684fe81982b1f5c8c5956dc55aae4fdbc5))

## [11.0.0-8](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-7...v11.0.0-8) (2021-10-26)


### Features

* removes remaning usage of browser API in rich text resolver ([74d1922](https://github.com/kontent-ai/delivery-sdk-js/commit/74d1922451d4350778587b9f2a183c34dccfe87d))

## [11.0.0-7](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-6...v11.0.0-7) (2021-10-26)


### Bug Fixes

* fixes object / json resolver result ([dc03d75](https://github.com/kontent-ai/delivery-sdk-js/commit/dc03d757b08c74187a17104f9ab5ee1451903ea0))

## [11.0.0-6](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-5...v11.0.0-6) (2021-10-26)


### Features

* adds experimental json / object rich text resolvers, simplifies filter classes ([326dff6](https://github.com/kontent-ai/delivery-sdk-js/commit/326dff69ebf6e2ab8932f60048118527377f1d17))
* refactors rich text processing by separating parser & rich text resolvers ([48b49da](https://github.com/kontent-ai/delivery-sdk-js/commit/48b49dac077ff91f89f5e959bb29b37f33909e5d))
* separates parser from resolvers and makes resolvers independent on parser implementation, adds experimental json / object rich text element resolvers ([24082ec](https://github.com/kontent-ai/delivery-sdk-js/commit/24082ec9c1d8d1ff0a4ea6212c52f23ee015cd1b))
* updates deps ([f3ccfb9](https://github.com/kontent-ai/delivery-sdk-js/commit/f3ccfb9f6af5f659c20f9d0825e404aa5b4bf0e3))

## [11.0.0-5](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-4...v11.0.0-5) (2021-10-19)


### Bug Fixes

* fixes value type for LinkedItemsElement ([b6cfc8e](https://github.com/kontent-ai/delivery-sdk-js/commit/b6cfc8e765ec90c475e87ba25ddc3c69c284f4b1))

## [11.0.0-4](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-3...v11.0.0-4) (2021-10-14)


### Features

* removes log message when content item is not in response ([b60f36b](https://github.com/kontent-ai/delivery-sdk-js/commit/b60f36b9b50cefbb2e7e5f8340c58143740698ee))
* use null for instead of undefined for some response models ([ff27a93](https://github.com/kontent-ai/delivery-sdk-js/commit/ff27a9346b9d1dcd587c337d37f629eddf933855))


### Bug Fixes

* use null for response models ([53792f1](https://github.com/kontent-ai/delivery-sdk-js/commit/53792f1cf2edc205f7270bdd6c9d361681fd8676))

## [11.0.0-3](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-2...v11.0.0-3) (2021-10-14)


### ⚠ BREAKING CHANGES

* use "string" type for all "Date" properties to support more serialization scenarios

### Features

* updates deps, removes duplicate license ([035335f](https://github.com/kontent-ai/delivery-sdk-js/commit/035335f050782091932a70cab6a8ba4ceb76e990))
* use "string" type for all "Date" properties to support more serialization scenarios ([909102f](https://github.com/kontent-ai/delivery-sdk-js/commit/909102fa8dc804a44d3480e166112232b98f2c39))

## [11.0.0-2](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-1...v11.0.0-2) (2021-10-04)


### Features

* adds ability to disable mapping of content items in linked items & rich text elements ([f67661c](https://github.com/kontent-ai/delivery-sdk-js/commit/f67661c2cc36a1d19d42a4036ac8ee67c7fd365a))
* adds came case, pascal case & snake case property name resolvers ([b422697](https://github.com/kontent-ai/delivery-sdk-js/commit/b42269721a930a83442d5842b2c31076e8ef6a92))

## [11.0.0-1](https://github.com/kontent-ai/delivery-sdk-js/compare/v11.0.0-0...v11.0.0-1) (2021-10-01)


### ⚠ BREAKING CHANGES

* makes rich text resolver generic, uninstalls unused packages, better organizes browser rich text parser code

### Features

* makes rich text resolver generic, uninstalls unused packages, better organizes browser rich text parser code ([29042b8](https://github.com/kontent-ai/delivery-sdk-js/commit/29042b8459c4ad5dedd357cc7a2f43c81da3bf3c))

## [11.0.0-0](https://github.com/kontent-ai/delivery-sdk-js/compare/v10.4.1...v11.0.0-0) (2021-09-30)


### ⚠ BREAKING CHANGES

* unifies contracts under a shared 'Contracts' namespace
* unifies all response models under common 'Responses' namespace
* converts image transformation enums (ImageFitModeEnum, ImageCompressionEnum, ImageFormatEnum) to types and removes the 'enum' suffix.
* renames 'ImageUrlBuilder' to 'ImageTransformationUrlBuilder'
* converts elements to types instead of interfaces (also removes the 'I' in the type names), adds 'createDeliveryClient' factory function, improves custom element sample
* renames 'IKontentNetworkResponse' and 'IGroupedKontentNetworkResponse' interfaces to 'INetworkResponse' and 'IGroupedNetworkResponse'
* removes query config from mapping service as its no longer necessary due to rich text resolver being separated
* refactors rich text resolver, removes parse5 and default html resolver for node, creates new html resolver for use in browsers and export it with the library
* removes 'itemCodenames' property from LinkedItemsElement because this data is already available in the value property
* `globalQueryConfig` configuration option was renamed to `defaultQueryConfig`
* removes _raw properties from content item & element to reduce the size of mapped response & to avoid data duplication
* uses interface for all remaining models & responses
* uses interfaces instead of classes for all responses
* refactors element models by using interfaces instead of classes, changes the ElementResolver to resolve only value instead of the whole custom element
* removes ItemResolver, refactors ContentItem from strongly types class to interface (removes ability to define resolvers on the class level)
* moves elements to 'elements' property within the content item (they were on the content item previously), removes property mapping with reflect metadata, removes collision resolver
* introduces new "IKontentNetworkResponse" model that wraps responses with network related data and separates response specific data for improved mapping of stored json data
* introduces BaseListingQuery for all endpoint with pagination, removes itemsFeedAll method & query, refactors queries to improve their readability, adds missing filter methods, unifies query config and some other minor improvements & changes
* renames withUrl query extension method to withCustomUrl
* renames query extension method 'withParameter' to 'withCustomParameter'. Adds new 'withParameter' method which takes IQueryParameter object similarly as 'withParameters' does for array parameters
* makes SortOrder type instead of enum
* updates kontent-core, removes rxjs from repository in favor of Promises and async based approach
* updates build process (puts all output to "dist" folder), consolidates tests, updates tsconfig

### Features

* `globalQueryConfig` configuration option was renamed to `defaultQueryConfig` ([8817105](https://github.com/kontent-ai/delivery-sdk-js/commit/881710530e4009defec3e7da9cc7763e18257a84))
* adds 'createUrlBuilder' factory function ([54b5085](https://github.com/kontent-ai/delivery-sdk-js/commit/54b5085a8dc0748f088b0b4ba894e403bb79bf42))
* adds 'withContinuationToken' extension method to all listing queries ([a28ddb3](https://github.com/kontent-ai/delivery-sdk-js/commit/a28ddb3e18162c8b80dabbf8967e64a23b40fbb1))
* adds 'withHeader' query extension method, improves docs of some extension methods ([20b9334](https://github.com/kontent-ai/delivery-sdk-js/commit/20b9334f22c2186a1b7276e5dbffbce05140fb36))
* adds ability to define number of pages to fetch in 'toAllPromise' method ([d5d8c2c](https://github.com/kontent-ai/delivery-sdk-js/commit/d5d8c2c2634d5d9f40718ab323184d6bf9c79ad7))
* adds ability to map raw json data with 'map' query extension method ([dab3618](https://github.com/kontent-ai/delivery-sdk-js/commit/dab3618a542692d67be18d8380b4d917e827d01f))
* adds network response tests ([0e8b690](https://github.com/kontent-ai/delivery-sdk-js/commit/0e8b6904af2b6205f6fb6426dabec9b6bf387539))
* adds support for 'workflow_step' in content item system attributes (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/309) ([ad2d965](https://github.com/kontent-ai/delivery-sdk-js/commit/ad2d965dc55742209b0715efabb0ea96cbc51638))
* adds support for async browser rich text resolver ([ece99b7](https://github.com/kontent-ai/delivery-sdk-js/commit/ece99b764013f6d6fd2663ae23eba68c4ad11c5e))
* converts elements to types instead of interfaces (also removes the 'I' in the type names), adds 'createDeliveryClient' factory function, improves custom element sample ([2ccb97c](https://github.com/kontent-ai/delivery-sdk-js/commit/2ccb97cd2f952bf20509956bf63832c0d39dee35))
* converts image transformation enums (ImageFitModeEnum, ImageCompressionEnum, ImageFormatEnum) to types and removes the 'enum' suffix. ([d44573a](https://github.com/kontent-ai/delivery-sdk-js/commit/d44573a472fce2baeadef25283a881e1b9ae094b))
* improves typings of raw response data by providing contract types for each query ([be654f1](https://github.com/kontent-ai/delivery-sdk-js/commit/be654f186cf1e62e7de8160bcf6adc4e73b85b48))
* introduces BaseListingQuery for all endpoint with pagination, removes itemsFeedAll method & query, refactors queries to improve their readability, adds missing filter methods, unifies query config and some other minor improvements & changes ([7c68b8f](https://github.com/kontent-ai/delivery-sdk-js/commit/7c68b8f910a1bf55c1ec6954c560d6e9f912c3c3))
* introduces new "IKontentNetworkResponse" model that wraps responses with network related data and separates response specific data for improved mapping of stored json data ([ba4c265](https://github.com/kontent-ai/delivery-sdk-js/commit/ba4c2657e70ab205fb776463170f2a1ab8fe7455))
* makes SortOrder type instead of enum ([1d61369](https://github.com/kontent-ai/delivery-sdk-js/commit/1d6136970b92f119c51612397a461603c0656a4c))
* moves elements to 'elements' property within the content item (they were on the content item previously), removes property mapping with reflect metadata, removes collision resolver ([8f6ed55](https://github.com/kontent-ai/delivery-sdk-js/commit/8f6ed55eb6d716d09edefcf30756ffe582d579ea))
* refactors element models by using interfaces instead of classes, changes the ElementResolver to resolve only value instead of the whole custom element ([c3fbd51](https://github.com/kontent-ai/delivery-sdk-js/commit/c3fbd51ccdba1ec15943f4ff31436696ef406d4f))
* refactors internal use of headers (stores headers in a single location) ([9c0fe73](https://github.com/kontent-ai/delivery-sdk-js/commit/9c0fe73cbf09de13593096bfdadf82abbd5effcd))
* refactors rich text resolver, removes parse5 and default html resolver for node, creates new html resolver for use in browsers and export it with the library ([04633a9](https://github.com/kontent-ai/delivery-sdk-js/commit/04633a94cbd1757166fc50450ee9ac0e529887ad))
* removes _raw properties from content item & element to reduce the size of mapped response & to avoid data duplication ([5c4eb8c](https://github.com/kontent-ai/delivery-sdk-js/commit/5c4eb8cf6dd2c1d9f2d6dcb3401c8afdb02af8b7))
* removes 'itemCodenames' property from LinkedItemsElement because this data is already available in the value property ([acefbe8](https://github.com/kontent-ai/delivery-sdk-js/commit/acefbe80bec23b788d659de827250d4fb0ac9a73))
* removes ItemResolver, refactors ContentItem from strongly types class to interface (removes ability to define resolvers on the class level) ([039ed29](https://github.com/kontent-ai/delivery-sdk-js/commit/039ed29b43870f3e7ee949106d85c7c49fe03c53))
* removes query config from mapping service as its no longer necessary due to rich text resolver being separated ([748b2f7](https://github.com/kontent-ai/delivery-sdk-js/commit/748b2f7c374e3e6c99a9d0d54c6dbd7dbcbe537b))
* renames 'IKontentNetworkResponse' and 'IGroupedKontentNetworkResponse' interfaces to 'INetworkResponse' and 'IGroupedNetworkResponse' ([9000c14](https://github.com/kontent-ai/delivery-sdk-js/commit/9000c141c6185ee0adc57cf902f47dc46af7b6ec))
* renames 'ImageUrlBuilder' to 'ImageTransformationUrlBuilder' ([8124cfe](https://github.com/kontent-ai/delivery-sdk-js/commit/8124cfe9ad62153832197883f053132b60a95b47))
* renames query extension method 'withParameter' to 'withCustomParameter'. Adds new 'withParameter' method which takes IQueryParameter object similarly as 'withParameters' does for array parameters ([a518694](https://github.com/kontent-ai/delivery-sdk-js/commit/a51869401f33a471829f648f93bd773006c98814))
* renames withUrl query extension method to withCustomUrl ([dbe6b77](https://github.com/kontent-ai/delivery-sdk-js/commit/dbe6b77efb9cf49f3ef26e57c59fc8fec8d9ce6b))
* unifies all response models under common 'Responses' namespace ([ad28631](https://github.com/kontent-ai/delivery-sdk-js/commit/ad286313d80a2683fd9100c79def21e0269cf0e8))
* unifies contracts under a shared 'Contracts' namespace ([41ddd98](https://github.com/kontent-ai/delivery-sdk-js/commit/41ddd98b31f4d54f90a7de97be8a0c96bd5ffd52))
* updates build process (puts all output to "dist" folder), consolidates tests, updates tsconfig ([c2946f7](https://github.com/kontent-ai/delivery-sdk-js/commit/c2946f7ce0d94d9b6365a42f5c04ea7e5c01126e))
* updates deps ([a18d770](https://github.com/kontent-ai/delivery-sdk-js/commit/a18d770c077620305be5b9b46254baf38a5ab42b))
* updates deps ([320d2df](https://github.com/kontent-ai/delivery-sdk-js/commit/320d2df3c00fcf71a76bb43fa4859cb13ed374af))
* updates deps ([67da9df](https://github.com/kontent-ai/delivery-sdk-js/commit/67da9dfb0184797909e0c78022653cf32a5a0951))
* updates kontent-core, removes rxjs from repository in favor of Promises and async based approach ([b213a7d](https://github.com/kontent-ai/delivery-sdk-js/commit/b213a7d2a520c3c9f395ce909d71f15802fc6581))
* uses interface for all remaining models & responses ([ad7b18d](https://github.com/kontent-ai/delivery-sdk-js/commit/ad7b18dcaa52b5fcdb9d7392da8e246567615796))
* uses interfaces instead of classes for all responses ([2cd8cb2](https://github.com/kontent-ai/delivery-sdk-js/commit/2cd8cb2684e54a7ad14292865b2adf5cf92c40df))

### [10.4.1](https://github.com/kontent-ai/delivery-sdk-js/compare/v10.4.0...v10.4.1) (2021-03-31)

## [10.4.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v10.3.0...v10.4.0) (2021-03-18)


### Features

* adds resolved attribute to BrowserRichTextParser, adds index to every resolved linked item & component within rich text element values ([b81d523](https://github.com/kontent-ai/delivery-sdk-js/commit/b81d523bb375b249e7ff44aec2df069890dfaba4))
* use switchMap instead of deprecated flatMap operator ([59bd752](https://github.com/kontent-ai/delivery-sdk-js/commit/59bd752dc7a1288218d5a2b9e63a682a773833c9))

## [10.3.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v10.2.0...v10.3.0) (2021-02-05)


### Features

* adds languages support (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/303) ([c145d93](https://github.com/kontent-ai/delivery-sdk-js/commit/c145d93ca8f293ec4fc99eb79fe1fa5a2c85cc60))

## [10.2.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v10.1.0...v10.2.0) (2021-01-08)


### Features

* updates dependencies ([651ccb4](https://github.com/kontent-ai/delivery-sdk-js/commit/651ccb44626c2542bf1caee83fc31ee4fd0b53a5))


### Bug Fixes

* updates internal types of parse5 parser adapter ([83109f7](https://github.com/kontent-ai/delivery-sdk-js/commit/83109f73003e233938c753d6795899f1b55e8ce4))

## [10.1.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v10.0.0...v10.1.0) (2020-11-26)


### Features

* adds support for collections
* updates all dependencies, uses axios models directly for request interceptors ([5aa5f8b](https://github.com/kontent-ai/delivery-sdk-js/commit/5aa5f8b4529ecfb8c3a9763db3755a36fa385267))

## [10.0.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v9.2.1...v10.0.0) (2020-08-25)


### ⚠ BREAKING CHANGES

* Refactors IQueryParameter to allows value-less parameters which are required by new filtering operators (empty / nempty), adds support for new filter options (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/297)

### Features

* Refactors IQueryParameter to allows value-less parameters which are required by new filtering operators (empty / nempty), adds support for new filter options (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/297) ([b2ae46f](https://github.com/kontent-ai/delivery-sdk-js/commit/b2ae46f615c6db7465125e09f8527fcfd49084a2))


### Bug Fixes

* fixes url resolving test for node.js ([212d343](https://github.com/kontent-ai/delivery-sdk-js/commit/212d34355104eb0201a3768d2bd198fc4b537176))

### [9.2.1](https://github.com/kontent-ai/delivery-sdk-js/compare/v9.2.0...v9.2.1) (2020-08-11)


### Bug Fixes

* fixes automatic format for image transformation api (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/296) ([42204ff](https://github.com/kontent-ai/delivery-sdk-js/commit/42204ff31a5f7cdbfcb684cb724ca6f24298f36c))

## [9.2.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v9.1.1...v9.2.0) (2020-07-30)


### Features

* updates dependencies, moves error handling logic from core package to sdk + fixes error mapping after recent error response change which now allows null in request_id property ([a11e745](https://github.com/kontent-ai/delivery-sdk-js/commit/a11e745d4148ac93dafa038f09bd6cd3b6b41a35))


### Bug Fixes

* improves handling of image resolving in rich text element and fixes parse5 parsing in nested component rich text resolver (https://github.com/kontent-ai/delivery-sdk-js/issues/294) ([9b82718](https://github.com/kontent-ai/delivery-sdk-js/commit/9b82718220c6affe62dfe8b79380323858db9e71))

### [9.1.1](https://github.com/kontent-ai/delivery-sdk-js/compare/v9.1.0...v9.1.1) (2020-04-02)


### Bug Fixes

* fixes missing attributes in parse5 resolved links with custom html ([2e2f8c1](https://github.com/kontent-ai/delivery-sdk-js/commit/2e2f8c1d1c92d15395a0bfb646c32781ae06fdbf))

## [9.1.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v9.0.0...v9.1.0) (2020-03-26)


### Features

* exposes richTextParserAdapter via config ([62659a6](https://github.com/kontent-ai/delivery-sdk-js/commit/62659a688661b5e786b853e7dd0e59aac2eeb02c))


### Bug Fixes

* fixes https://github.com/kontent-ai/delivery-sdk-js/issues/286 & unifies parse5 / browser tests ([2a787f4](https://github.com/kontent-ai/delivery-sdk-js/commit/2a787f4ec237528a55ae3df7676ed348cf502e87))

## [9.0.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v8.2.0...v9.0.0) (2020-01-20)


### ⚠ BREAKING CHANGES

* updates deps, refactors retry-strategy which enables specifying either maximum number of attemps or wait time and allows retry of any error even when response is not received (e.g. timeout which could not be retried previously)

### Features

* distributes library in esNext format ([bd9ea6f](https://github.com/kontent-ai/delivery-sdk-js/commit/bd9ea6f5f7dd81277d59c8a85e9952bde0ed74f6))
* refactors item mappers and adds full mapping support to items-feed endpoints (e.g. rich text resolver, url slug resolver, image resolver ..) ([6e30485](https://github.com/kontent-ai/delivery-sdk-js/commit/6e304856fda0a7d9c55e2910dac2578014cedc37))
* updates deps, refactors retry-strategy which enables specifying either maximum number of attemps or wait time and allows retry of any error even when response is not received (e.g. timeout which could not be retried previously) ([b7cf414](https://github.com/kontent-ai/delivery-sdk-js/commit/b7cf414bc2da0f4fc42368fd5ab44a555bf36afc))

## [8.2.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v8.1.0...v8.2.0) (2019-11-25)


### Features

* adds helper method to return linked items as array (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/240) ([b832f7b](https://github.com/kontent-ai/delivery-sdk-js/commit/b832f7b67c85fce0d80e763a2207afb859855fc8))
* extends ContentItem with ability to get all elements in an array (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/241) ([120918b](https://github.com/kontent-ai/delivery-sdk-js/commit/120918bc9d724efd765cf320e676bbd56a6f9fa4))
* updates all dependencies (including dev depencies such as the use of latest TypeScript..) ([62a9ffc](https://github.com/kontent-ai/delivery-sdk-js/commit/62a9ffc1b8ead493b6adc891fbb9bd05ed629070))


### Bug Fixes

* fixes github repo url in package.json & fixes changelog links (fixes https://github.com/kontent-ai/delivery-sdk-js/issues/268) ([a4132e7](https://github.com/kontent-ai/delivery-sdk-js/commit/a4132e7d95a6c99ade17c487b68721fb0bafc58c))

## [8.1.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v8.0.0...v8.1.0) (2019-11-18)


### Features

* adds support for 'includeTotalCount| parameter ([c39a301](https://github.com/kontent-ai/delivery-sdk-js/commit/c39a301bf73c72b4e87db071a4293c7f45ef0c8e))


### Bug Fixes

* updates kontent-core package which fixes http retry requests ([53a4318](https://github.com/kontent-ai/delivery-sdk-js/commit/53a43184a708c0c36fbe611d99a6298f24ad097a))

## [8.0.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v7.2.0...v8.0.0) (2019-10-25)


### ⚠ BREAKING CHANGES

* Updates @kentico/kontent-core to v4 and uses new and improved retry strategy. 'retryAttempts' configuration option was removed in favor of 'retryStrategy' object.

### Features

* adds 'itemsFeedAll' method to get all items from a project. This method may execute multiple HTTP requests. Reworks base responses & debug to allow different debug types per response. ([72e03fd](https://github.com/kontent-ai/delivery-sdk-js/commit/72e03fd3587573d82d665e0010c696e122e73248))
* adds support for 'items-feed' endpoint ([29913c9](https://github.com/kontent-ai/delivery-sdk-js/commit/29913c984b073166a8f0ddc12f69106c7d476efd))
* Updates @kentico/kontent-core to v4 and uses new and improved retry strategy. 'retryAttempts' configuration option was removed in favor of 'retryStrategy' object. ([e2abd02](https://github.com/kontent-ai/delivery-sdk-js/commit/e2abd02a233f78f9c9152397f5eb915d73ba1189))


### Bug Fixes

* prepares instances of all items before resolving occurs to prevent some items from being skipped ([5559cb6](https://github.com/kontent-ai/delivery-sdk-js/commit/5559cb608668f608f759256f0a35486fb7397d9c))

## [7.2.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v7.1.0...v7.2.0) (2019-10-21)


### Features

* Enables resolving links without content item representation in response ([6472265](https://github.com/kontent-ai/delivery-sdk-js/commit/6472265867d8b6dc200ff756032a75a848b0d92c))
* takes 'isDeveloperMode' settings into account when displaying root debug element (https://github.com/kontent-ai/delivery-sdk-js/issues/255] ([7ab56cb](https://github.com/kontent-ai/delivery-sdk-js/commit/7ab56cb64703e7481ea02433ad5aca95bd9b8b51))
* updates @kentico/kontent-core dependency which enables configuring axios request (https://github.com/kontent-ai/delivery-sdk-js/issues/256) ([ea3a504](https://github.com/kontent-ai/delivery-sdk-js/commit/ea3a504e3a2eb37a06d40daf5a40ea11dfbe517f))

## 7.1.0 (2019-10-14)

## [7.1.0](https://github.com/kontent-ai/delivery-sdk-js/compare/v7.0.1...v7.1.0) (2019-10-14)

### Features

* adds hasStaleContent property to all responses and uses new BaseDeliveryResponse base class ([3dc5046](https://github.com/kontent-ai/delivery-sdk-js/commit/3dc50463a70a3f70e3f0920ed11758f62efdb236))

### [7.0.1](https://github.com/kontent-ai/delivery-sdk-js/compare/v1.1.0...v7.0.1) (2019-10-14)

