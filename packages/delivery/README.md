# Kentico Cloud Delivery SDK

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Build Status](https://api.travis-ci.org/Enngage/kentico-cloud-js.svg?branch=master)](https://travis-ci.org/Enngage/kentico-cloud-js)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-delivery.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)
[![Known Vulnerabilities](https://snyk.io/test/github/enngage/kentico-cloud-js/badge.svg)](https://snyk.io/test/github/enngage/kentico-cloud-js)
[![GitHub license](https://img.shields.io/github/license/Enngage/kentico-cloud-js.svg)](https://github.com/Enngage/kentico-cloud-js)
![Gzip browser bundle](http://img.badgesize.io/https://unpkg.com/kentico-cloud-delivery@latest/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js?compression=gzip)

A client library for retrieving content from [Kentico Cloud](https://kenticocloud.com/) for both `Node` and `browsers`. Library supports `ES2015` and is fully written in `TypeScript`.

# [Full Documentation](https://github.com/Enngage/kentico-cloud-js/blob/master/doc/delivery.md)

# [Example apps](https://github.com/Enngage/kentico-cloud-js/tree/master/examples)

## Installation

### npm

```
npm i rxjs --save
npm i kentico-cloud-delivery --save
```

### unpkg - browser only & minified

```
https://unpkg.com/kentico-cloud-delivery@latest/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js
```

### unpkg - node + browser & minified
```
https://unpkg.com/kentico-cloud-delivery@latest/_bundles/kentico-cloud-delivery-sdk.umd.min.js
```

## Getting data from cloud (TypeScript & ES2015)

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

## Getting data from cloud (JavaScript & CommonJS)

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

## Getting data from Cloud (Pure HTML)

```html
<!DOCTYPE html>
<html>
<head>
	<title>Kentico Cloud SDK - Html sample</title>
	<script type="text/javascript" src="https://unpkg.com/kentico-cloud-delivery@latest/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js"></script>
</head>
<body>

	<script type="text/javascript">
		var deliveryClient = new DeliveryClient({
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

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Enngage/kentico-cloud-js/master/packages/delivery?pixel)
