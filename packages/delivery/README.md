# Kentico Cloud Delivery SDK

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Build Status](https://api.travis-ci.org/Kentico/kentico-cloud-js.svg?branch=master)](https://travis-ci.org/Kentico/kentico-cloud-js)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-delivery.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kentico-cloud-js/badge.svg)](https://snyk.io/test/github/kentico/kentico-cloud-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kentico-cloud-js.svg)](https://github.com/Kentico/kentico-cloud-js)
![Gzip browser bundle](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/kentico-cloud-delivery/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js?compression=gzip)
[![](https://data.jsdelivr.com/v1/package/npm/kentico-cloud-delivery/badge)](https://www.jsdelivr.com/package/npm/kentico-cloud-delivery)

A client library for retrieving content from [Kentico Cloud](https://kenticocloud.com/) written in TypeScript and published in following formats: `UMD`, `ES2015` and `CommonJs`. Works both in browser & node.

|  Resources 
|---|
|  [Full Documentation](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery/DOCS.md) |
|  [Example apps](https://github.com/Kentico/kentico-cloud-js/tree/master/examples) | 
|  [API Reference](https://kentico.github.io/kentico-cloud-js/delivery/) | 


## Installation

You can install this library using `npm` or you can use global CDNs such `jsdelivr` directly. In both cases, you will also need to include `rxjs` as its listed as peer dependency. 

### npm

```
npm i rxjs --save
npm i kentico-cloud-delivery --save
```

### CDN

When using UMD bundle and including this library in `script` tag on your `html` page, you can find it under the `kenticoCloudDelivery` global variable.

You can decide whether to get library including full node support or just browser only. If you choose browser only version, an external dependency used for parsing HTML in `node.js` is not included and therefore the size of library is smaller.

#### Node + browser (UMD)

![Gzip full bundle](https://img.badgesize.io/https://unpkg.com/kentico-cloud-delivery@latest/_bundles/kentico-cloud-delivery-sdk.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/kentico-cloud-delivery/_bundles/kentico-cloud-delivery-sdk.umd.min.js
```

#### Browser only (UMD)

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/kentico-cloud-delivery@latest/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/kentico-cloud-delivery/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js
```

## Quick start (TypeScript & ES2015)

```typescript
import { 
    ContentItem, 
    Fields,
    TypeResolver,
    DeliveryClient
    } from 'kentico-cloud-delivery';

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

## Quick start (JavaScript & CommonJS)

```javascript
const KenticoCloud = require('kentico-cloud-delivery');

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
const subscription = deliveryClient.items()
    .type('movie')
    .getObservable()
    .subscribe(response => {
        const movieText = response.items[0].title.text;
    });

/*
Don't forget to unsubscribe from your Observables. You can use 'takeUntil' or 'unsubscribe' method for this purpose. Unsubsription is usually done when you no longer need to process the result of Observable. (Example: 'ngOnDestroy' event in Angular app)
*/
subscription.unsubscribe();

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

## Quick start (HTML & UMD)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Kentico Cloud SDK - Html sample</title>
    <script type="text/javascript" src="https://unpkg.com/rxjs@6.4.0/bundles/rxjs.umd.min.js"></script>
	<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/kentico-cloud-delivery/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js"></script>
</head>
<body>

	<script type="text/javascript">
		var Kc = window['kenticoCloudDelivery'];

		var deliveryClient = new Kc.DeliveryClient({
			projectId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9'
		});

		deliveryClient.items()
			.type('movie')
			.getPromise()
			.then(response => console.log(response));

	</script>
	<h1>See console</h1>
</body>
</html>
```

## Testing

Note: You need to have `Chrome` installed in order to run tests via Karma.

- `npm run test:browser` Runs tests in Chrome 
- `npm run test:node` Runs tests in node.js
- `npm run test:dev` Runs developer tests (useful for testing functionality)
- `npm run test:travis` Runs browser tests that are executed by travis

> If you want to mock http responses, it is possible to use [external implementation of configurable Http Service](../core/README.md#testing) as a part of the [delivery client configuration](DOCS.md#client-configuration).

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/kentico-cloud-js/master/packages/delivery?pixel)
