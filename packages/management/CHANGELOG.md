## 0.1.0 (2019-09-16)

#### :rocket: Enhancement
  * Release for new `Kentico Kontent` branding. 

## 0.0.17 (2019-09-09)

#### :boom: Breaking Change
  * [#247](https://github.com/Kentico/kentico-kontent-js/pull/247) Adds support for 'List language variants of a content type' api call, renames 'listLanguageVariants' and related models to contain item identifier such as 'listLanguageVariantsOfItem' ([@Enngage](https://github.com/Enngage))

#### :rocket: Enhancement
  * [#249](https://github.com/Kentico/kentico-kontent-js/pull/249) Adds support for new Taxonomy listing endpoint while staying compatible with previous one ([@Enngage](https://github.com/Enngage))
  * [#248](https://github.com/Kentico/kentico-kontent-js/pull/248) Adds support for all Language related endpoints  ([@Enngage](https://github.com/Enngage))
  * [#247](https://github.com/Kentico/kentico-kontent-js/pull/247) Adds support for 'List language variants of a content type' api call, renames 'listLanguageVariants' and related models to contain item identifier such as 'listLanguageVariantsOfItem' ([@Enngage](https://github.com/Enngage))

## 0.0.16 (2019-06-04)

#### :rocket: Enhancement
  * [#196](https://github.com/Kentico/kentico-kontent-js/pull/196) Axios security update + dev dependency update + version patch ([@Enngage](https://github.com/Enngage))

#### :rocket: Enhancement
  * [#173](https://github.com/Kentico/kentico-kontent-js/pull/173) Makes contentLength optional ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#174](https://github.com/Kentico/kentico-kontent-js/pull/174) Fixes missing internal config propery for upload binary file service method ([@Enngage](https://github.com/Enngage))

## 0.0.14 (2019-04-24)

#### :rocket: Enhancement
  * [#164](https://github.com/Kentico/kentico-kontent-js/pull/164) Implements upsert content item API endpoint ([@Enngage](https://github.com/Enngage))
  * [#163](https://github.com/Kentico/kentico-kontent-js/pull/163) Adds support for specifying 'scheduled_to' data body param for publish or schedule to publish query), exposes data related properties for all queries ([@Enngage](https://github.com/Enngage))

## 0.0.13 (2019-04-04)

#### :house: Internal
  * Fixes incorrect response type for viewing assets

## 0.0.12 (2019-04-04)

#### :house: Internal
  * [#160](https://github.com/Kentico/kentico-kontent-js/pull/160) Adds ability to specify response type of HTTP call ([@Enngage](https://github.com/Enngage))

## 0.0.11 (2019-03-28)

#### :rocket: Enhancement
  * Adds workflow step properties to language variant model/contract ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#157](https://github.com/Kentico/kentico-kontent-js/pull/157) Fixes incorrect import path in base service ([@Enngage](https://github.com/Enngage))

#### :house: Internal
  * [#157](https://github.com/Kentico/kentico-kontent-js/pull/157)  Switch to 'karma-typescript' and 'karma-typescript-es6-transform' for better performance, adds CircleCI badges ([@Enngage](https://github.com/Enngage))
  * [#156](https://github.com/Kentico/kentico-kontent-js/pull/156) Updates dev dependencies and some scripts (+ preparation for circle ci) ([@Enngage](https://github.com/Enngage))

## 0.0.10 (2019-03-26)

#### :rocket: Enhancement
  * [#155](https://github.com/Kentico/kentico-kontent-js/pull/155) Implements remainder of workflow related actions - upublishing item cancelling publish and creating new versions ([@Enngage](https://github.com/Enngage))
  * [#154](https://github.com/Kentico/kentico-kontent-js/pull/154) Uses Content Management specific error and sets validation errors where applicable ([@Enngage](https://github.com/Enngage))
  * [#153](https://github.com/Kentico/kentico-kontent-js/pull/153) Update to kentico-cloud-core@1.4.4 ([@Enngage](https://github.com/Enngage))

## 0.0.9 (2019-03-22)

#### :rocket: Enhancement
  * [#149](https://github.com/Kentico/kentico-kontent-js/pull/149) Adds external_id, taxonomy_group and snippet to content type elementmodel, updates docs and package version ([@Enngage](https://github.com/Enngage))

## 0.0.8 (2019-03-21)

#### :rocket: Enhancement
  * Uses relative import path for content type models

## 0.0.7 (2019-03-08)

#### :rocket: Enhancement
  * [#148](https://github.com/Kentico/kentico-kontent-js/pull/148) Prepares data models for 'AddContentType' action ([@Enngage](https://github.com/Enngage))
* Other
  * [#146](https://github.com/Kentico/kentico-kontent-js/pull/146) SEX-872 - Fix Insecure Protocol ([@dusekdan](https://github.com/dusekdan))

## 0.0.6 (2019-03-08)

#### :rocket: Enhancement
  * Uses undefined as body for workflow related actions (will be changed in future to incorporate scheduled_to functionality) ([@Enngage](https://github.com/Enngage))

## 0.0.5 (2019-03-08)

#### :rocket: Enhancement
  * [#136](https://github.com/Kentico/kentico-kontent-js/pull/136) Renames methods in query builder to reflect what type, implements change workflow step & publish language variant API methods ([@Enngage](https://github.com/Enngage))
  * [#132](https://github.com/Kentico/kentico-kontent-js/pull/132) Adds ability to configure status codes of requests that should be retried and adds support for retrying Promises ([@Enngage](https://github.com/Enngage))
  * [#131](https://github.com/Kentico/kentico-kontent-js/pull/131) Updates kentico-cloud-core dependency to 1.4.3 ([@Enngage](https://github.com/Enngage))
  * [#130](https://github.com/Kentico/kentico-kontent-js/pull/130) Refactors identifiers and makes content management actions more streamlined. Also adds support for change workflow step API action ([@Enngage](https://github.com/Enngage))
  * [#112](https://github.com/Kentico/kentico-kontent-js/pull/112) Link test http service mention to the docs ([@Simply007](https://github.com/Simply007))


## 0.0.4 (2019-02-07)

#### :rocket: Enhancement
  * [#108](https://github.com/Kentico/kentico-kontent-js/pull/108) Support for create content type API ([@Enngage](https://github.com/Enngage))

#### :memo: Documentation
  * [#106](https://github.com/Kentico/kentico-kontent-js/pull/106) Fixes typo and improves retryAttempts description ([@Enngage](https://github.com/Enngage))
  * Other
  * [#105](https://github.com/Kentico/kentico-kontent-js/pull/105) Uses jsdelivr for badges ([@Enngage](https://github.com/Enngage))

