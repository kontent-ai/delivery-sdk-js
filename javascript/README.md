# Kentico Cloud Delivery JavaScript SDK

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)
[![Build Status](https://api.travis-ci.org/Enngage/KenticoCloudDeliveryTypeScriptSDK.svg?branch=master)](https://travis-ci.org/Enngage/KenticoCloudDeliveryTypeScriptSDK)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)
[![Coverage Status](https://coveralls.io/repos/github/Enngage/KenticoCloudDeliveryTypeScriptSDK/badge.svg?branch=master)](https://coveralls.io/github/Enngage/KenticoCloudDeliveryTypeScriptSDK?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/enngage/kenticoclouddeliverytypescriptsdk/badge.svg)](https://snyk.io/test/github/enngage/kenticoclouddeliverytypescriptsdk)
[![Dependency Status](https://dependencyci.com/github/Enngage/KenticoCloudDeliveryTypeScriptSDK/badge)](https://dependencyci.com/github/Enngage/KenticoCloudDeliveryTypeScriptSDK)

Sample plain JavaScript application using this SDK: [Javascript app](https://github.com/Enngage/KenticoCloudSampleJavascriptApp)

Developer SDK for retrieving content from [Kentico Cloud](https://kenticocloud.com/).

As this SDK is written in TypeScript, it is transpiled into JavaScript that you can use in any JavaScript application without having any knowledge about TypeScript. Using the SDK in JavaScript is very similar to TypeScript with very few differences such as that:

* Types are not supported (you cannot use `deliveryClient.items<Movie>()`)
* Properties don't need to be defined in your models as they will be assigned by the SDK 
* Compilation for browser use has to be done manually (I recommend checking out [Browserify](http://browserify.org/) which makes this very easy)

For more in-depth examples see the [TypeScript SDK Documentation](https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK)

## Installation with npm

```
npm i kentico-cloud-delivery-typescript-sdk --save
```

### Getting started example

```javascript
var kc = require('kentico-cloud-delivery-typescript-sdk');
var projectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

/**
 * Class representing the content type. It is not necessary to manually define properties in JavaScript
 * as all properties will be auto-assigned by the SDK
 */
class Movie extends kc.ContentItem {
    constructor() {
        super();
    }
}

/**
* Type resolvers make sure that the items returned from Kentico Cloud are casted to your classes (useful when you define * custom properties/functions on your models)
*/
var typeResolvers = [
    new kc.TypeResolver('movie', () => new Movie()),
];

/**
 * Delivery client configuration object
 */
var config = new kc.DeliveryClientConfig(projectId, typeResolvers);

/**
 * Create new instance of Delivery Client and use it to fetch data from Kentico Cloud
 */
var deliveryClient = new kc.DeliveryClient(config);

/**
 * Fetch all items of 'movie' type and given parameters from Kentico Cloud
 */
deliveryClient.items()
    .type('movie')
    .get()
    .subscribe(response => console.log(response));

```

### Compile JavaScript for Browser use

Install [Browserify](http://browserify.org/) globally:

```
npm i browserify -g
```

Compile your code into JavaScript that can be used within your browser and deploy `bundle.js` JavaScript file:

```
browserify nameOfYourFile.js -o bundle.js
```

#### More examples

```javascript
/**
 * Fetch all items of 'movie' type and given parameters from Kentico Cloud
 */
deliveryClient.items()
    .type('movie')
    .limitParameter(10)
    .orderParameter('system.codename', kc.SortOrder.desc)
    .depthParameter(5)
    .get()
    .subscribe(response => console.log(response));

/**
 * Fetch single item with given codename from Kentico cloud
 */
deliveryClient.item('tom_hardy')
    .get()
    .subscribe(response => {
        console.log(response);
        console.log(`The URL of actor '${response.item.system.name}' resolved to: '${response.item.url.getUrl()}'`);
    });

/**
 * Fetch types
 */
deliveryClient.types()
    .limitParameter(2)
    .get()
    .subscribe(response => console.log(response));

/**
 * Fetch taxonomies
 */
deliveryClient.taxonomies()
    .get()
    .subscribe(response => console.log(response));

/**
 * By calling 'toString()' on any query, you can get the URL of the Kentico Cloud endpoint
 */
var itemsUrl = deliveryClient.items()
    .type('movie')
    .limitParameter(10)
    .orderParameter('system.codename', kc.SortOrder.desc)
    .depthParameter(5)
    .toString();

console.log(`Following is an URL of items query: ${itemsUrl}`);

/**
 * Debug information containing the raw Ajax response
 */
deliveryClient.items()
    .get()
    .subscribe(response => console.log(response.debug));

/**
 * Use with Promises
 */
deliveryClient.items()
    .get()
    .toPromise()
    .then(response => console.log(`Item '${response.firstItem.system.codename}' was fetched using a Promise`));
```

For more in-depth examples see the [TypeScript SDK Documentation](https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK)

## Scripts

- Use `npm test` to run all tests.
- Use `npm run dev-test` to run developer tests created in `dev-test` folder. Use this for your testing purposes.
- Use `npm run build` to generate definitions & dist from the contents of `lib` folder.
- Use `npm run coveralls` to push coverage data directly to [https://coveralls.io](https://coveralls.io). Can be executed only after running`npm test`.

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.
