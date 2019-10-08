## 7.0.1 (2019-09-25)

#### :rocket: Enhancement
  * Updates docs on npm. No code changes.

## 7.0.0 (2019-09-16)

#### :rocket: Enhancement
  * Release for new `Kentico Kontent` branding. 

## 6.2.0 (2019-08-21)

#### :rocket: Enhancement
  * [#239](https://github.com/Kentico/kentico-kontent-js/pull/239) Handles unknown data item types in rich text elements, renames richTextElement.resolveHtml to resolveData ([@Enngage](https://github.com/Enngage))

## 6.1.0 (2019-08-21)

#### :rocket: Enhancement
  * [#238](https://github.com/Kentico/kentico-kontent-js/pull/238) Extracts codenames of linked items & components from rich text elements and adds 'resolveData' method to 'RichTextElement' which can be used instead of 'getHtml' to retrieve additional data. Improves error/warning messages in resolver and adds parse5 tests covering rich text. ([@Enngage](https://github.com/Enngage))

## 6.0.0 (2019-08-15)

This release contains several breaking changes. To see how you can upgrade from version `5.x.y` see this [upgrade guide](https://github.com/Kentico/kentico-kontent-js/blob/master/packages/delivery/UPGRADE.md)

You may also see the changelog below for a list of commits/PRs that were made since previous major release. 

## 6.0.0-rc.5 (2019-08-14)

#### :bug: Bug Fix
  * [#235](https://github.com/Kentico/kentico-kontent-js/pull/235) Fixes mapping of 0 values in number element ([@Enngage](https://github.com/Enngage))

## 6.0.0-rc.4 (2019-08-14)

#### :boom: Breaking Change
  * [#234](https://github.com/Kentico/kentico-kontent-js/pull/234) Preserves null values for number/custom and datetime elements ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#233](https://github.com/Kentico/kentico-kontent-js/pull/233) Renames 'contentTypeSystem' to 'contentItemSystem' in IElementWrapper ([@Enngage](https://github.com/Enngage))

## 6.0.0-rc.3 (2019-08-08)

#### :boom: Breaking Change
  * [#232](https://github.com/Kentico/kentico-kontent-js/pull/232) Moves '_debug.rawElements' property of 'ContentItem' to '_raw.elements' ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#231](https://github.com/Kentico/kentico-kontent-js/pull/231) Fixes typo in 'InFilter' class ([@Enngage](https://github.com/Enngage))

## 6.0.0-rc.2 (2019-08-06)

#### :boom: Breaking Change
  * [#229](https://github.com/Kentico/kentico-kontent-js/pull/229) Introduces new LinkedItemsElement used in favor of direct ContentItem mapping, adds UnknownElement to be future proof in case new element type is added to CMS ([@Enngage](https://github.com/Enngage))

## 6.0.0-rc.1 (2019-08-05)

#### :boom: Breaking Change
  * [#226](https://github.com/Kentico/kentico-kontent-js/pull/226) Renames `linkResolver` to `urlSlugResolver` and changes its return type to `IUrlSlugResolverResult` - this change means that string can no longer be a return type. ([@Enngage](https://github.com/Enngage))
  * [#227](https://github.com/Kentico/kentico-kontent-js/pull/227) Adds configuration property `globalQueryConfig` which represents global configuration for all queries. Removes `secure` and `preview` configuration properties in favor of the new `globalQueryConfig`. Preview & Secured keys are defined directly in `IDeliveryClientConfig` ([@Enngage](https://github.com/Enngage))

## 6.0.0-rc.0 (2019-07-17)

#### :boom: Breaking Change
  * [#221](https://github.com/Kentico/kentico-kontent-js/pull/221) Fixes content type model names, refactors delivery client configuration (separates preview, secure & proxy into own sub categories) ([@Enngage](https://github.com/Enngage))

* [#220](https://github.com/Kentico/kentico-kontent-js/pull/220) Renames response models, contracts & maps to match API endpoints & official docs (+ unification of names across endpoints) ([@Enngage](https://github.com/Enngage))

- `baseUrl` & `basePreviewUrl` moved to `proxy`
- `proxyUrl` renamed to `advancedProxyUrlResolver`
- `enableAdvancedLogging` renamed to `isDeveloperMode`

[#218](https://github.com/Kentico/kentico-kontent-js/pull/218) Refactors ResponseMapper and provides new MappingService which is accessible through DeliveryClient and can be used for mapping directly from JSON ([@Enngage](https://github.com/Enngage))

- **Field** was renamed to **Element** to unify it with Kentico Kontent terminology. This change affects class names, namespaces, method names & file paths.
- Type specific properties for elements (e.g. 'text' property for `TextElement` or 'number' for `NumberElement` ) were replaced by `value` property
- `getHtml` renamed to `resolveHtml` in `RichTextElement`
- `getUrl` renamed to `resolveUrl` in `UrlSlugElement`
- `CustomField` renamed to `DefaultCustomElement`

  * [#216](https://github.com/Kentico/kentico-kontent-js/pull/216) Renames `debug` property to `_debug` on `ContentItem`, groups resolver properties under `_config` property rather than polluting `ContentItem` model, improves typings on `ContentItem`  ([@Enngage](https://github.com/Enngage))
  * [#213](https://github.com/Kentico/kentico-kontent-js/pull/213) Delivery fields refactoring ([@Enngage](https://github.com/Enngage))

#### :rocket: Enhancement
  * [#222](https://github.com/Kentico/kentico-kontent-js/pull/222) Adds typings for modularContent in itemResolver and consolidates contract names for modular_content ([@Enngage](https://github.com/Enngage))
  * [#218](https://github.com/Kentico/kentico-kontent-js/pull/218) Refactors ResponseMapper and provides new MappingService which is accessible through DeliveryClient and can be used for mapping directly from JSON ([@Enngage](https://github.com/Enngage))
  * [#216](https://github.com/Kentico/kentico-kontent-js/pull/216) Renames 'debug' property to '_debug' on ContentItem, groups resolver properties under '_config' property rather than polluting ContentItem model, improves typings on ContentItem  ([@Enngage](https://github.com/Enngage))
  * [#213](https://github.com/Kentico/kentico-kontent-js/pull/213) Delivery fields refactoring ([@Enngage](https://github.com/Enngage))

#### :house: Internal
  * [#215](https://github.com/Kentico/kentico-kontent-js/pull/215) Refactors interfaces & models by grouping them alongside each other ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.11 (2019-07-12)

#### :rocket: Enhancement
  * [#198](https://github.com/Kentico/kentico-kontent-js/pull/198) Legacy browser support ([@Enngage](https://github.com/Enngage))
  * Removes `Content-Type` header from `GET` requests (https://github.com/Kentico/kentico-kontent-js/commit/6544c88ea88c78be4390f9b194ca390e66c16df3)

## 6.0.0-beta.10 (2019-06-04)

#### :boom: Breaking Change
  * [#194](https://github.com/Kentico/kentico-kontent-js/pull/194) Implements support for resolving images resolved by nested linked items, removes 'elements' property in favor of 'debug' property (breaking change) ([@Enngage](https://github.com/Enngage))

#### :rocket: Enhancement
  * [#196](https://github.com/Kentico/kentico-kontent-js/pull/196) Axios security update + dev dependency update + version patch ([@Enngage](https://github.com/Enngage))
  * [#193](https://github.com/Kentico/kentico-kontent-js/pull/193) Adds 'data' parameter containing raw item & modular_content data to TypeResolver.Resolve callback, refactors the way links are resolved inside rich text elements ([@Enngage](https://github.com/Enngage))
  * [#192](https://github.com/Kentico/kentico-kontent-js/pull/192) Refactors delivery item strongly typed resolver, sets default item type to 'IContentItem' ([@Enngage](https://github.com/Enngage))

#### :house: Internal
* `delivery`
  * [#191](https://github.com/Kentico/kentico-kontent-js/pull/191) Fixes racing condition in test ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.9 (2019-05-27)

#### :rocket: Enhancement
  * [#188](https://github.com/Kentico/kentico-kontent-js/pull/188) Makes configuration of global headers function instead of static array ([@Enngage](https://github.com/Enngage))
  * Updated `kentico-cloud-core` to `1.5.0` 
  * [#186](https://github.com/Kentico/kentico-kontent-js/pull/186) Removes try/catch to preserve original error thrown in richTextResolver  ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.8 (2019-05-14)

#### :rocket: Enhancement
  * [#172](https://github.com/Kentico/kentico-kontent-js/pull/172) Adds ability to fully customize request URLs using 'proxyUrl' configuration option (https://github.com/Kentico/kentico-kontent-js/issues/171) ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.7 (2019-05-03)

#### :bug: Bug Fix
  * Uses `data-sdk-resolved` attribute for resolved rich text elements to comply with HTML standards.

## 6.0.0-beta.6 (2019-05-03)

#### :bug: Bug Fix
  * [#170](https://github.com/Kentico/kentico-kontent-js/pull/170) Prevents duplicate resolving of linked items by flagging resolved elements (https://github.com/Kentico/kentico-kontent-js/issues/165) ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.5 (2019-05-02)

#### :bug: Bug Fix
  * [#168](https://github.com/Kentico/kentico-kontent-js/pull/168) Fixes incorrect item codename used for recursive linked item parse5 resolver (fixes https://github.com/Kentico/kentico-kontent-js/issues/165) ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.4 (2019-04-30)

#### :rocket: Enhancement
  * [#166](https://github.com/Kentico/kentico-kontent-js/pull/166) Adds support for delivery image dimension properties ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#167](https://github.com/Kentico/kentico-kontent-js/pull/167) Recursively processes HTML resolved by richTextResolvers in browserRichTextAdapter, fixes an issue when images of nested items were not available in resolver context ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.3 (2019-04-24)

#### :bug: Bug Fix
  * [#162](https://github.com/Kentico/kentico-kontent-js/pull/162) Fixes mapping of 'last_modified' system attribute value. This was incorrectly mapped as string even though specified type is Date. Currently the value is a Date object. ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta.2 (2019-03-12)

#### :rocket: Enhancement
  * [#153](https://github.com/Kentico/kentico-kontent-js/pull/153) Update to kentico-cloud-core@1.4.4 ([@Enngage](https://github.com/Enngage))
  
## 6.0.0-beta.1 (2019-03-26)

#### :boom: Breaking Change
  * [#141](https://github.com/Kentico/kentico-kontent-js/pull/141) Renames 'getObservable' & 'getPromise' to 'toPromise' and 'toObservable' ([@Enngage](https://github.com/Enngage))

## 6.0.0-beta-0 (2019-03-12)

#### :boom: Breaking Change
  * [#139](https://github.com/Kentico/kentico-kontent-js/pull/139) Changes the type of 'linkedItems' delivery model response from array to IContentItemsContainer - this change improves performance as we avoid filtering on arrays and use codenames with direct access. ([@Enngage](https://github.com/Enngage))

#### :rocket: Enhancement
  * [#139](https://github.com/Kentico/kentico-kontent-js/pull/139) Improves mapping of circular linked items be keeping references between them. This change enables recursive references between items. ([@Enngage](https://github.com/Enngage))

## 5.7.2 (2019-03-08)

#### :bug: Bug Fix
   * [#138](https://github.com/Kentico/kentico-kontent-js/pull/138) Fixes an issue when mapper would throw Stackoverflow exception when child item contained linked reference to parent ([@Enngage](https://github.com/Enngage))

## 5.7.1 (2019-02-26)

#### :rocket: Enhancement
  * [#128](https://github.com/Kentico/kentico-kontent-js/pull/128) Adds ability to configure error status codes of request that should be retried ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#127](https://github.com/Kentico/kentico-kontent-js/pull/127) Updates to kentico-cloud-core@1.4.3 (fixes timeouts when retrying Promise requests) ([@Enngage](https://github.com/Enngage))

## 5.7.0 (2019-02-26)

#### :rocket: Enhancement
  * [#124](https://github.com/Kentico/kentico-kontent-js/pull/124) Adds retry functionality to Promise execution ([@Enngage](https://github.com/Enngage))
  
## 5.6.0 (2019-02-26)

#### :rocket: Enhancement
  * [#120](https://github.com/Kentico/kentico-kontent-js/pull/120) Adds 'linkedItems' property holding all resolved linked items in a flat structure ([@Enngage](https://github.com/Enngage))
  * [#118](https://github.com/Kentico/kentico-kontent-js/pull/118) Removes duplicate code by creating parser configuration object ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#119](https://github.com/Kentico/kentico-kontent-js/pull/119) Fixes an issue where a content item would be resolved multiple times in certain scenarios ([@Enngage](https://github.com/Enngage))

#### :memo: Documentation
  * [#117](https://github.com/Kentico/kentico-kontent-js/pull/117) Extends collisionResolver docs ([@Enngage](https://github.com/Enngage))
  * [#116](https://github.com/Kentico/kentico-kontent-js/pull/116) Uses jsdelivr CDN in HTML examples ([@Enngage](https://github.com/Enngage))

## 5.5.0 (2019-02-21)

#### :rocket: Enhancement
  * [#115](https://github.com/Kentico/kentico-kontent-js/pull/115) Handles element name collisions and uses dedicated types for resolvers ([@Enngage](https://github.com/Enngage))

#### :bug: Bug Fix
  * [#115](https://github.com/Kentico/kentico-kontent-js/pull/115) Fixes browser's UMD library bundle global property ([@Enngage](https://github.com/Enngage))

#### :memo: Documentation
  * [#112](https://github.com/Kentico/kentico-kontent-js/pull/112) Link test http service mention to the docs ([@Simply007](https://github.com/Simply007))

## 5.4.0 (2019-02-13)

#### :rocket: Enhancement
  * [#111](https://github.com/Kentico/kentico-kontent-js/pull/111) Feat image resolver ([@Enngage](https://github.com/Enngage))
