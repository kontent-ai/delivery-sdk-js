# Kentico Cloud Delivery JavaScript / TypeScript SDK

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)
[![Build Status](https://api.travis-ci.org/Enngage/KenticoCloudDeliveryTypeScriptSDK.svg?branch=master)](https://travis-ci.org/Enngage/KenticoCloudDeliveryTypeScriptSDK)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)
[![Coverage Status](https://coveralls.io/repos/github/Enngage/KenticoCloudDeliveryTypeScriptSDK/badge.svg?branch=master)](https://coveralls.io/github/Enngage/KenticoCloudDeliveryTypeScriptSDK?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/enngage/kenticoclouddeliverytypescriptsdk/badge.svg)](https://snyk.io/test/github/enngage/kenticoclouddeliverytypescriptsdk)

A client library for retrieving content from [Kentico Cloud](https://kenticocloud.com/) that supports JavaScript and TypeScript.

<table>
<tbody>
<tr>
<th><h3>TypeScript</h3></th><th><h3>JavaScript</h3></th>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK">Documentation</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK">Documentation</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#installation">Quick start</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#installation">Quick start</a></td>
</tr>
<tr>
<th colspan="2">Sample apps</th>
</tr>
<tr>
<td>Angular 5+ app (<a href="https://stackblitz.com/edit/kentico-cloud-angular-5-demo">live demo</a>, <a href="https://github.com/Enngage/KenticoCloudSampleAngularApp">github</a>)</td>
<td><a href="https://github.com/Enngage/KenticoCloudSampleJavascriptApp">JavaScript app</a></td>
</tr>
<tr>
<th colspan="2">Configuration</th>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#client-configuration">Client configuration</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#client-configuration">Client configuration</a></td>
</tr>
<th colspan="2">API documentation</th>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#installation#getting-data-observable">Get items (Observable)</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#getting-data-observable">Get items (Observable)</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#getting-data-promise">Get items (Promise)</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#getting-data-promise">Get items (Promise)</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#creating-models">Creating models</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#creating-models">Creating models</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#dont-want-to-waste-time-creating-models-manually">Model generator</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#dont-want-to-waste-time-creating-models-manually">Model generator</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#initializing-deliveryclient">Initialize client</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#initializing-deliveryclient">Initialize client</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#using-query-parameters">Query parameters</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#using-query-parameters">Query parameters</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#filtering">Filtering</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#filtering">Filtering</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#sorting">Sorting</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#sorting">Sorting</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#getting-localized-items">Localization</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#getting-localized-items">Localization</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#property-binding-in-models">Property binding / Model decorators</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#property-binding-in-models">Property binding</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#preview-mode">Preview mode</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#preview-mode">Preview mode</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#secured-delivery-api-mode">Secured API mode</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#secured-delivery-api-mode">Secured API mode</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#url-slugs-links">URL slugs</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#url-slugs-links">URL slugs</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#resolving-modular-content-in-rich-text-fields">Rich text resolver</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#resolving-modular-content-in-rich-text-fields">Rich text resolver</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#strongly-typed-nested-property">Strongly typed nested property</a></td><td>N/A</td>
</tr>

<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#getting-content-types">Get types</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#getting-content-types">Get types</a></td>
</tr>

<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#working-with-taxonomies">Get taxonomies</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#working-with-taxonomies">Get taxonomies</a></td>
</tr>
<tr>
<th colspan="2">Errors</th>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#handling-errors">Handling errors</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#handling-errors">Handling errors</a></td>
</tr>
<tr>
<th colspan="2">Debugging</th>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#accessing-request-data">Request data</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#accessing-request-data">Request data</a></td>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/TypeScript-SDK#installation#getting-url-of-a-query">Getting URL</a></td><td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/wiki/JavaScript-SDK#getting-url-of-a-query">Getting URL</a></td>
</tr>
</tbody>
</table>

## Node.js support

Visit <a href="https://github.com/Enngage/KenticoCloudDeliveryNodeSDK">GitHub repository 
</a> to see how you can use this SDK in Node.js environment.

## Quick start

```
npm i kentico-cloud-delivery-typescript-sdk --save
```

### TypeScript & ES6

```typescript
import { 
    ContentItem, 
    Fields,
    TypeResolver,
    DeliveryClient
    } from 'kentico-cloud-delivery-typescript-sdk';

/**
 * This is optional, but it is considered a best practice to define your models
 * so you can leverage intellisense and so that you can extend your models with 
 * additional properties / methods.
 */
export class Movie extends ContentItem {
  public title: Fields.TextField;
}

const deliveryClient = new DeliveryClient({
    projectId: 'xxx',
    typeResolvers: [
        new TypeResolver('movie', () => new Movie()),
    ]
});

/** Getting items from Kentico Cloud as Promise */
deliveryClient.items<Movie>()
    .type('movie')
    .getPromise()
    .then(response => {
        const movieText = response.items[0].title.text;
    )
});

/** Getting items from Kentico Cloud as Observable */
deliveryClient.items<Movie>()
    .type('movie')
    .getObservable()
    .subscribe(response => {
        const movieText = response.items[0].title.text;
    )
});

/**
 * Get data without having custom models 
 */
deliveryClient.items<ContentItem>()
  .type('movie')
  .get()
  .subscribe(response => {
    // you can access properties same way as with strongly typed models, but note
    // that you don't get any intellisense and the underlying object 
    // instance is of 'ContentItem' type
    console.log(response.items[0].title.text);
});

```
### JavaScript & CommonJS

```javascript
const KenticoCloud = require('kentico-cloud-delivery-typescript-sdk');

class Movie extends KenticoCloud.ContentItem {
    constructor() {
        super();
    }
}

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'xxx',
    typeResolvers: [
        new KenticoCloud.TypeResolver('movie', () => new Movie()),
    ]
});

/** Getting items from Kentico Cloud as Promise */
deliveryClient.items()
    .type('movie')
    .getPromise()
    .then(response => {
        const movieText = response.items[0].title.text;
    )
});

/** Getting items from Kentico Cloud as Observable */
deliveryClient.items()
    .type('movie')
    .getObservable()
    .subscribe(response => {
        const movieText = response.items[0].title.text;
    )
});

/**
 * Fetch all items of 'movie' type and given parameters from Kentico Cloud.
 * Important note: SDK will convert items to your type if you registered it. For example,
 * in this case the objects will be of 'Movie' type we defined above. 
 * If you don't use custom models, 'ContentItem' object instances will be returned.
 */
deliveryClient.items()
    .type('movie')
    .getObservable()
    .subscribe(response => console.log(response));
```

## Testing

Note: You need to have `Firefox` installed in order to run tests via Karma.

- Use `npm test` to run all tests. 
- Use `npm run dev-test` to run developer tests created in `dev-test` folder. Use this for your testing purposes.

## Publishing

In order to publish SDK first run one of following tasks to increase version & update sdk info file:

- `npm run new-patch`
- `npm run new-minor`
- `npm run new-major`

And then run (note that tests and necessary scripts are automatically executed using the `prepublishOnly` script):

- `npm run publish`

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.

