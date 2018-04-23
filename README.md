# Kentico Cloud Delivery JavaScript / TypeScript SDK

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)
[![Build Status](https://api.travis-ci.org/Enngage/KenticoCloudDeliveryTypeScriptSDK.svg?branch=master)](https://travis-ci.org/Enngage/KenticoCloudDeliveryTypeScriptSDK)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)
[![Coverage Status](https://coveralls.io/repos/github/Enngage/KenticoCloudDeliveryTypeScriptSDK/badge.svg?branch=master)](https://coveralls.io/github/Enngage/KenticoCloudDeliveryTypeScriptSDK?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/enngage/kenticoclouddeliverytypescriptsdk/badge.svg)](https://snyk.io/test/github/enngage/kenticoclouddeliverytypescriptsdk)

A client library for retrieving content from [Kentico Cloud](https://kenticocloud.com/) written in TypeScript and shipped with UMD bundles for easy browser use.

# [Full Documentation ](https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/tree/major-version/doc)

## Quick start

```
npm i kentico-cloud-delivery-typescript-sdk --save
```

### TypeScript & ES2015

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

## Browser & Node.js support

Both browser & node.js are supported by this library. However, due to some differences (especially around parsing HTML) library uses `parse5` to parse HTML in node.js environment and DOM in browsers. Since `parse5` is relatively bulky library, we are shipping a browser only UMD package without this dependency to keep the library size to a minimum. 

## Testing

Note: You need to have `Firefox` installed in order to run tests via Karma.

- `npm run test:browser` Runs tests in Firefox 
- `npm run test:node` Runs tests in node.js
- `npm run test:dev` Runs developer tests (useful for testing functionality)
- `npm run test:travis` Runs browser tests that are executed by travis

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.

