## 2.0.0 (2019-09-16)

#### :rocket: Enhancement
  * Release for new `Kentico Kontent` branding. 

## 1.7.1 (2019-08-06)

#### :rocket: Enhancement
  * [#230](https://github.com/Kentico/kentico-kontent-js/pull/230) Implements retryPromise method in TestHttpService to not throw exceptions if used externally ([@Enngage](https://github.com/Enngage))

## 1.7.0 (2019-07-12)

#### :rocket: Enhancement
  * [#198](https://github.com/Kentico/kentico-kontent-js/pull/198) Legacy browser support ([@Enngage](https://github.com/Enngage))
  * Removes `Content-Type` header from `GET` requests (https://github.com/Kentico/kentico-kontent-js/commit/6544c88ea88c78be4390f9b194ca390e66c16df3)

## 1.6.0 (2019-06-04)

#### :rocket: Enhancement
  * [#196](https://github.com/Kentico/kentico-kontent-js/pull/196) Axios security update + dev dependency update + version patch ([@Enngage](https://github.com/Enngage))

#### Committers: 1
- Richard Sustek ([@Enngage](https://github.com/Enngage))


## delivery@6.0.0-beta.9 (2019-05-27)

#### :rocket: Enhancement
* `delivery`
  * [#188](https://github.com/Kentico/kentico-kontent-js/pull/188) Makes configuration of global headers function instead of static array ([@Enngage](https://github.com/Enngage))

## 1.5.0 (2019-05-27)

#### :rocket: Enhancement
  * [#187](https://github.com/Kentico/kentico-kontent-js/pull/187) Isolates axios instance and implements http interceptors  ([@Enngage](https://github.com/Enngage))
  * [#185](https://github.com/Kentico/kentico-kontent-js/pull/185) updates dependencies ([@Enngage](https://github.com/Enngage))

## 1.4.5 (2019-04-04)

#### :house: Internal
  * [#160](https://github.com/Kentico/kentico-kontent-js/pull/160) Adds ability to specify response type of HTTP call ([@Enngage](https://github.com/Enngage))

## 1.4.4 (2019-03-26)

#### :rocket: Enhancement
  * [#151](https://github.com/Kentico/kentico-kontent-js/pull/151) Preserves original error when mapping to BaseKontentError ([@Enngage](https://github.com/Enngage))

## 1.4.3 (2019-02-26)

#### :bug: Bug Fix
  * [#126](https://github.com/Kentico/kentico-kontent-js/pull/126) Stores current retry attempt to ensure correct timeout is used for retrying additional requests ([@Enngage](https://github.com/Enngage))
  
## 1.4.2 (2019-02-26)

#### :bug: Bug Fix
  * [#123](https://github.com/Kentico/kentico-kontent-js/pull/123) Fix response mapping if request is successful for the first time ([@Enngage](https://github.com/Enngage))
  
## 1.4.1 (2019-02-26)

#### :bug: Bug Fix
  * [#122](https://github.com/Kentico/kentico-kontent-js/pull/122) Fixes mapping of Promise response ([@Enngage](https://github.com/Enngage))
  
## 1.4.0 (2019-02-26)

#### :rocket: Enhancement
  * [#121](https://github.com/Kentico/kentico-kontent-js/pull/121) Adds support for retrying Promises ([@Enngage](https://github.com/Enngage))
  * [#112](https://github.com/Kentico/kentico-kontent-js/pull/112) Link test http service mention to the docs ([@Simply007](https://github.com/Simply007))
