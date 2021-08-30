# Kentico Kontent Delivery SDK

[![npm version](https://badge.fury.io/js/%40kentico%2Fkontent-delivery.svg)](https://badge.fury.io/js/%40kentico%2Fkontent-delivery)
[![Build](https://github.com/Kentico/kontent-delivery-sdk-js/actions/workflows/test.yml/badge.svg)](https://github.com/Kentico/kontent-delivery-sdk-js/actions/workflows/test.yml)
[![CircleCI](https://circleci.com/gh/Kentico/kontent-delivery-sdk-js/tree/master.svg?style=svg)](https://circleci.com/gh/Kentico/kontent-delivery-sdk-js/tree/master)
[![npm](https://img.shields.io/npm/dt/@kentico/kontent-delivery.svg)](https://www.npmjs.com/package/@kentico/kontent-delivery)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kontent-delivery-sdk-js/badge.svg)](https://snyk.io/test/github/kentico/kontent-delivery-sdk-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kontent-delivery-sdk-js.svg)](https://github.com/Kentico/kontent-delivery-sdk-js)
![Gzip browser bundle](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/_bundles/kontent-delivery.browser.umd.min.js?compression=gzip)
[![](https://data.jsdelivr.com/v1/package/npm/@kentico/kontent-delivery/badge)](https://www.jsdelivr.com/package/npm/kentico-kotent-delivery)

[![Discord](https://img.shields.io/discord/821885171984891914?label=Discord&logo=Discord&logoColor=white)](https://discord.gg/SKCxwPtevJ)

A client library for retrieving content from [Kentico Kontent](https://kontent.ai/) written in TypeScript and published in following formats: `UMD`, `ES2015` and `CommonJs`. Works both in browser & node.

|  Resources 
|---|
|  [Full Documentation](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md) |
|  [Example apps](https://github.com/Kentico/kontent-delivery-sdk-js/tree/master/examples) | 
|  [Upgrade guide](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/UPGRADE.md) | 


## Installation

You can install this library using `npm` or you can use global CDNs such `jsdelivr` directly.

### npm

```
npm i @kentico/kontent-delivery --save
```

### UMD Bundles

When using UMD bundle and including this library in `script` tag on your `html` page, you can find it under the `kontentDelivery` global variable.

Bundles are distributed in `_bundles` folder and there are several options that you can choose from. 

- Use `kontent-delivery.browser.legacy.umd.min` if you need to support legacy browsers (IE9, IE10, IE11)
- Use `kontent-delivery.browser.umd.min` if you intend to use SDK only in browsers (strips code specific to Node.js = smaller bundle)
- Use `kontent-delivery.umd.min` if you need to use it in Node.js

#### CDN

##### kontent-delivery.browser.legacy.umd.min

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-delivery@latest/_bundles/kontent-delivery.browser.legacy.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/_bundles/kontent-delivery.browser.legacy.umd.min.js
```

##### kontent-delivery.browser.umd.min

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-delivery@latest/_bundles/kontent-delivery.browser.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/_bundles/kontent-delivery.browser.umd.min.js
```

##### kontent-delivery.umd.min

![Gzip full bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-delivery@latest/_bundles/kontent-delivery.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/_bundles/kontent-delivery.umd.min.js
```

## TypeScript & ES6

```typescript
import { 
    ContentItem, 
    Elements,
    TypeResolver,
    DeliveryClient
    } from '@kentico/kontent-delivery';

/**
 * This is optional, but it is considered a best practice to define your models
 * so you can leverage intellisense and so that you can extend your models with 
 * additional properties / methods.
 */
export class Movie extends ContentItem {
  public title: Elements.TextElement;
}

const deliveryClient = new DeliveryClient({
    projectId: 'xxx',
    typeResolvers: [
        new TypeResolver('movie', () => new Movie()),
    ]
});

/** Getting items from Kentico Kontent as Promise */
const response = await deliveryClient.items<Movie>()
    .type('movie')
    .toPromise();
```

## JavaScript & CommonJS

```javascript
const KontentDelivery = require('@kentico/kontent-delivery');

class Movie extends KontentDelivery.ContentItem {
    constructor() {
        super();
    }
}

const deliveryClient = new KontentDelivery.DeliveryClient({
    projectId: 'xxx',
    typeResolvers: [
        new KontentDelivery.TypeResolver('movie', () => new Movie()),
    ]
});

const response = await deliveryClient.items()
    .type('movie')
    .toPromise();
```

## HTML & UMD

Bundles are distributed in `dist/bundles` folder and there are several options that you can choose from. 

```html
<!DOCTYPE html>
<html>
<head>
    <title>Kentico Kontent SDK - Html sample</title>
	<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/dist/bundles/kontent-delivery.umd.min.js"></script>
</head>
<body>

	<script type="text/javascript">
		var Kc = window['kontentDelivery'];

		var deliveryClient = new Kc.DeliveryClient({
			projectId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9'
		});

		deliveryClient.items()
			.type('movie')
			.toPromise()
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

