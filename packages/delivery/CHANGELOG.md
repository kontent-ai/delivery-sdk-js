## 6.0.0-beta.5 (2019-05-02)

#### :bug: Bug Fix
  * [#168](https://github.com/Kentico/kentico-cloud-js/pull/168) Fixes incorrect item codename used for recursive linked item parse5 resolver (fixes https://github.com/Kentico/kentico-cloud-js/issues/165) ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.4 (2019-04-30)

#### :rocket: Enhancement
  * [#166](https://github.com/Kentico/kentico-cloud-js/pull/166) Adds support for delivery image dimension properties ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#167](https://github.com/Kentico/kentico-cloud-js/pull/167) Recursively processes HTML resolved by richTextResolvers in browserRichTextAdapter, fixes an issue when images of nested items were not available in resolver context ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.3 (2019-04-24)

#### :bug: Bug Fix
  * [#162](https://github.com/Kentico/kentico-cloud-js/pull/162) Fixes mapping of 'last_modified' system attribute value. This was incorrectly mapped as string even though specified type is Date. Currently the value is a Date object. ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.2 (2019-03-12)

#### :rocket: Enhancement
  * [#153](https://github.com/Kentico/kentico-cloud-js/pull/153) Update to kentico-cloud-core@1.4.4 ([@Enngage](https://github.com/Enngage))
  
## 6.0.0-beta.1 (2019-03-26)

#### :boom: Breaking Change
  * [#141](https://github.com/Kentico/kentico-cloud-js/pull/141) Renames 'getObservable' & 'getPromise' to 'toPromise' and 'toObservable' ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta-0 (2019-03-12)

#### :boom: Breaking Change
  * [#139](https://github.com/Kentico/kentico-cloud-js/pull/139) Changes the type of 'linkedItems' delivery model response from array to IContentItemsContainer - this change improves performance as we avoid filtering on arrays and use codenames with direct access. ([@Enngage](https://github.com/Enngage))

#### :rocket: Enhancement
  * [#139](https://github.com/Kentico/kentico-cloud-js/pull/139) Improves mapping of circular linked items be keeping references between them. This change enables recursive references between items. ([@Enngage](https://github.com/Enngage))

## 5.7.2 (2019-03-08)

#### :bug: Bug Fix
   * [#138](https://github.com/Kentico/kentico-cloud-js/pull/138) Fixes an issue when mapper would throw Stackoverflow exception when child item contained linked reference to parent ([@Enngage](https://github.com/Enngage))

## 5.7.1 (2019-02-26)

#### :rocket: Enhancement
  * [#128](https://github.com/Kentico/kentico-cloud-js/pull/128) Adds ability to configure error status codes of request that should be retried ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#127](https://github.com/Kentico/kentico-cloud-js/pull/127) Updates to kentico-cloud-core@1.4.3 (fixes timeouts when retrying Promise requests) ([@Enngage](https://github.com/Enngage))

## 5.7.0 (2019-02-26)

#### :rocket: Enhancement
  * [#124](https://github.com/Kentico/kentico-cloud-js/pull/124) Adds retry functionality to Promise execution ([@Enngage](https://github.com/Enngage))
  
## 5.6.0 (2019-02-26)

#### :rocket: Enhancement
  * [#120](https://github.com/Kentico/kentico-cloud-js/pull/120) Adds 'linkedItems' property holding all resolved linked items in a flat structure ([@Enngage](https://github.com/Enngage))
  * [#118](https://github.com/Kentico/kentico-cloud-js/pull/118) Removes duplicate code by creating parser configuration object ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#119](https://github.com/Kentico/kentico-cloud-js/pull/119) Fixes an issue where a content item would be resolved multiple times in certain scenarios ([@Enngage](https://github.com/Enngage))

#### :memo: Documentation
  * [#117](https://github.com/Kentico/kentico-cloud-js/pull/117) Extends collisionResolver docs ([@Enngage](https://github.com/Enngage))
  * [#116](https://github.com/Kentico/kentico-cloud-js/pull/116) Uses jsdelivr CDN in HTML examples ([@Enngage](https://github.com/Enngage))

## 5.5.0 (2019-02-21)

#### :rocket: Enhancement
  * [#115](https://github.com/Kentico/kentico-cloud-js/pull/115) Handles field name collisions and uses dedicated types for resolvers ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#115](https://github.com/Kentico/kentico-cloud-js/pull/115) Fixes browser's UMD library bundle global property ([@Enngage](https://github.com/Enngage))

#### :memo: Documentation
  * [#112](https://github.com/Kentico/kentico-cloud-js/pull/112) Link test http service mention to the docs ([@Simply007](https://github.com/Simply007))

## 5.4.0 (2019-02-13)

#### :rocket: Enhancement
  * [#111](https://github.com/Kentico/kentico-cloud-js/pull/111) Feat image resolver ([@Enngage](https://github.com/Enngage))
