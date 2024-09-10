[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fdelivery-sdk.svg)](https://badge.fury.io/js/%40kontent-ai%2Fdelivery-sdk)
[![Build](https://github.com/kontent-ai/delivery-sdk-js/actions/workflows/test.yml/badge.svg)](https://github.com/kontent-ai/delivery-sdk-js/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/dt/@kontent-ai/delivery-sdk.svg)](https://www.npmjs.com/package/@kontent-ai/delivery-sdk)
[![Known Vulnerabilities](https://snyk.io/test/github/kontent-ai/delivery-sdk-js/badge.svg)](https://snyk.io/test/github/kontent-ai/delivery-sdk-js)
[![GitHub license](https://img.shields.io/github/license/kontent-ai/delivery-sdk-js.svg)](https://github.com/kontent-ai/delivery-sdk-js)
![Gzip browser bundle](https://img.badgesize.io/https:/cdn.jsdelivr.net/npm/@kontent-ai/delivery-sdk/dist/bundles/kontent-delivery.umd.min.js?compression=gzip)
[![Discord](https://img.shields.io/discord/821885171984891914?label=Discord&logo=Discord&logoColor=white)](https://discord.gg/SKCxwPtevJ)

# JavaScript Delivery SDK Documentation

This library is build for fetching [Kontent.ai](https://kontent.ai/) data with `Delivery API`. Works in browser & node.

> [!TIP]  
> It's highly recommended to use this library in combination with
> [Model Generator](https://www.npmjs.com/package/@kontent-ai/model-generator). This will enable you to access your data
> in a strongly typed manner and will greatly simplify working with your data.

# Kontent.ai Delivery SDK

## Installation

```bash
npm i @kontent-ai/delivery-sdk --save
```

## UMD

When using UMD bundle and including this library in `script` tag on your `html` page, you can find it under the
`kontentDelivery` global variable.

Bundles are distributed in `dist/bundles` folder:

-   `dist/bundles/kontent-delivery.umd.js`
-   `dist/bundles/kontent-delivery.umd.min.js`

## Getting started

```typescript
import { type IContentItem, type Elements, createDeliveryClient } from '@kontent-ai/delivery-sdk';

/**
 * Generate models with @kontent-ai/model-generator
 */
export type Movie = IContentItem<{
    readonly title: Elements.TextElement;
    readonly plot: Elements.RichTextElement;
    readonly released: Elements.DateTimeElement;
    readonly length: Elements.NumberElement;
    readonly poster: Elements.AssetsElement;
    readonly category: Elements.MultipleChoiceElement;
    readonly stars: Elements.LinkedItemsElement<Actor>;
    readonly seoname: Elements.UrlSlugElement;
    readonly releasecategory: Elements.TaxonomyElement;
}>;

// initialize delivery client
const deliveryClient = createDeliveryClient({
    environmentId: '<YOUR_ENVIRONMENT_ID>'
});

// fetch items
const response = await deliveryClient.items<Movie>().type('<CONTENT_TYPE_CODENAME>').toPromise();

// read data of first item
const movieText = response.data.items[0].elements.title.value;
```

## Configuration

| Property                     |                   type                   | description                                                                                                                                                                                                                       |
| ---------------------------- | :--------------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| environmentId                |                  string                  | environmentId of your Kontent.ai project                                                                                                                                                                                          |
| elementResolver?             |             ElementResolver              | Element resolver used to map custom elements                                                                                                                                                                                      |
| previewApiKey?               |                  string                  | Preview API key used to get unpublished content items                                                                                                                                                                             |
| defaultLanguage?             |                  string                  | Sets default language that will be used for all queries unless overridden with query parameters                                                                                                                                   |
| proxy?                       |        IDeliveryClientProxyConfig        | Can be used to configure custom URLs. Useful when you use reverse proxy or have a need to transform URL - e.g. to remove 'environmentId'                                                                                          |
| secureApiKey?                |                  string                  | Secured API key: Use secured API only when running on Node.JS server, otherwise you can expose your key                                                                                                                           |
| defaultQueryConfig?          |               IQueryConfig               | Default configuration for all queries. Can be overridden by individual queries                                                                                                                                                    |
| httpService ?                |               IHttpService               | Can be used to inject custom http service for performing requests                                                                                                                                                                 |
| globalHeaders?               | (queryConfig: IQueryConfig) => IHeader[] | Adds ability to add extra headers to each http request                                                                                                                                                                            |
| retryStrategy?               |          IRetryStrategyOptions           | Retry strategy configuration                                                                                                                                                                                                      |
| linkedItemsReferenceHandler? |       LinkedItemsReferenceHandler        | Indicates if content items are automatically mapped. Available values: 'map' or 'ignore'                                                                                                                                          |
| assetsDomain?                |                  string                  | Custom domain for assets. Changes url of assets in both asset & rich text elements                                                                                                                                                |
| defaultRenditionPreset?      |                  string                  | Codename of rendition preset to be applied by default to the base asset URL path when present. When set, the SDK will provide the URL of customized images by default. Right now the only supported preset codename is `default`. |
| excludeArchivedItems?        |                 boolean                  | Can be used to exclude archived items from all queries by default. Only applicable when preview API is used.                                                                                                                      |

### Use custom models for Custom elements

You can register an `ElementResolver` to map custom elements into dedicated element models and work with data more
effectively.

For example, if you have a custom `color` element in your Kontent.ai project with json data like:

```json
 "color": {
  "type": "custom",
  "name": "Color",
  "value": "{\"red\":167,\"green\":96,\"blue\":197}"
  }
```

You can create a `ColorElement` type with strongly typed properties for `red`, `green` & `blue` values that you will
parse from the json.

```typescript
import { ElementModels, Elements, createDeliveryClient } from '@kontent-ai/delivery-sdk';

type ColorElement = Elements.CustomElement<{
    red: number;
    green: number;
    blue: number;
}>;
```

To resolve your custom element into `ColorElement`, use the `ElementResolver` in your delivery client config:

```typescript
const client = createDeliveryClient({
    environmentId: '<YOUR_ENVIRONMENT_ID>',
    elementResolver: (elementWrapper) => {
        if (elementWrapper.rawElement.type === 'color') {
            const parsed = JSON.parse(elementWrapper.rawElement.value);

            return {
                red: parsed.red,
                green: parsed.green,
                blue: parsed.blue
            };
        }

        return undefined;
    }
});
```

You can then use this custom element type in your models:

```typescript
type Movie = IContentItem<{
    color: ColorElement;
    title: Elements.TextElement;
}>;
```

### Querying

The SDK supports the following query parameters: `depthParameter`, `elementsParameter`, `excludeElementsParameter`,
`limitParameter`, `orderParameter`, `skipParameter` and `languageParameter`. For more information about the parameters,
see the [SDK query methods](#filter-content) below. You can also head over to
[Delivery API reference](https://kontent.ai/learn/docs/apis/openapi/delivery-api/#tag/Filtering-parameters).

```typescript
// Gets 5 items based on the Movie type
deliveryClient.items<Movie>().type('movie').limitParameter(5).skipParameter(2).toPromise();
```

| Filter                     |
| -------------------------- |
| `depthParameter`           |
| `elementsParameter`        |
| `excludeElementsParameter` |
| `limitParameter`           |
| `orderParameter`           |
| `skipParameter`            |
| `languageParameter`        |

#### Filtering

Filters are also considered query parameters and can be combined. See
[Content filtering in API reference](https://kontent.ai/learn/docs/apis/openapi/delivery-api/#tag/Filtering-parameters)
for more examples.

```typescript
// Gets items based on the Movie type with 'Warrior' in their 'Title' element
deliveryClient.items<Movie>().type('movie').equalsFilter('elements.title', 'Warrior').toPromise();
```

| Filter                     |
| -------------------------- |
| `type`                     |
| `types`                    |
| `allFilter`                |
| `anyFilter`                |
| `containsFilter`           |
| `equalsFilter`             |
| `greaterThanFilter`        |
| `greaterThanOrEqualFilter` |
| `inFilter`                 |
| `lessThanFilter`           |
| `lessThanOrEqualFilter`    |
| `rangeFilter`              |
| `emptyFilter`              |
| `NotEmptyFilter`           |
| `notEqualsFilter`          |
| `notInFilter`              |

#### Soring

You can sort data by using any of the following methods:

```typescript
deliveryClient.items<Movie>().type('movie').orderByDescending('elements.title').toPromise();
deliveryClient.items<Movie>().type('movie').orderByAscending('elements.title').toPromise();
deliveryClient.items<Movie>().type('movie').orderParameter('elements.title', 'desc').toPromise();
```

### Execute queries with a custom URL

When you have an URL (i.e. for `next page` in paging, for testing purposes or just if you prefer to build it on your
own) and still want to leverage SDK functionality such as type mapping, property resolving etc., use `withUrl` parameter
on any query such as:

```typescript
deliveryClient
    .items<Movie>()
    .withUrl('https://deliver.kontent.ai/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items?system.type=movie')
    .toPromise();
```

### Custom parameters

In case you need to use custom parameters to build up an URL, use `withParameter` method:

```typescript
deliveryClient.items<Movie>().withParameter('name', 'value').toPromise();
```

### Get localized items

You can specify [language of items](https://kontent.ai/learn/tutorials/manage-kontent/projects/set-up-languages) with
`languageParameter` of a particular query. You can also define default language that will be used if `languageParameter`
is not used during the initialization of delivery client.

```typescript
import { createDeliveryClient } from '@kontent-ai/delivery-sdk';

var deliveryClient = new createDeliveryClient({
    environmentId: '<YOUR_ENVIRONMENT_ID>',
    defaultLanguage: 'es'
});

// Gets items in 'es' language because it is marked as default
deliveryClient.item('warrior').toPromise();

// Gets items in 'en' language because language parameter has priority over the default one
deliveryClient.item('warrior').languageParameter(`en`).toPromise();
```

### Preview mode

You can enable the preview mode either globally (when [initializing the DeliveryClient](#how-to-use-deliveryclient)) or
per query. In each case, you need to set `previewApiKey` in the delivery client global configuration.

#### Enable preview mode globally

```typescript
import { createDeliveryClient } from '@kontent-ai/delivery-sdk';

const deliveryClient = createDeliveryClient({
  environmentId: '<YOUR_ENVIRONMENT_ID>';
  previewApiKey: '<YOUR_PREVIEW_API_KEY>',
  defaultQueryConfig: {
    usePreviewMode: true
  }
});
```

#### Enable preview mode per query

```typescript
deliveryClient
    .items()
    .queryConfig({
        usePreviewMode: true
    })
    .toPromise();
```

### Secure Delivery API

Using the Delivery API with
[secure access](https://kontent.ai/learn/tutorials/develop-apps/build-strong-foundation/restrict-public-access) enabled
is recommend only when the request is not being executed on the client (browser) because otherwise you will expose the
API key publicly.

```typescript
import { createDeliveryClient } from '@kontent-ai/delivery-sdk';

const deliveryClient = createDeliveryClient({
  environmentId: '<YOUR_ENVIRONMENT_ID>';
  secureApiKey: '<YOUR_SECURE_ACCESS_KEY>',
    defaultQueryConfig: {
      // Enabled secure access for all queries
      useSecuredMode: true
  }
});
```

As with [preview mode](#preview-mode), you can also override global settings on query level.

```typescript
deliveryClient
    .items()
    .queryConfig({
        // Enables secure access only for this query
        useSecuredMode: true
    })
    .toPromise();
```

### Image transformation

Use `ImageUrlBuilder` for your [image transformations](https://kontent.ai/learn/reference/image-transformation) on asset
URLs.

```typescript
import { transformImageUrl } from '@kontent-ai/delivery-sdk';

// Sample asset URL; You'll find URLs like these in asset and rich text elements
const assetUrl = `https://assets-eu-01.kc-usercontent.com/ede994d8-bb05-01b5-9c33-8b65e7372306/4f45e0a8-4fc3-4143-a81f-55b7e4ce7daa/warrior.jpg`;

const transformedUrl = transformImageUrl(assetUrl)
    .withDpr(2)
    .withCompression('lossless')
    .withQuality(4)
    .withHeight(200)
    .withWidth(100)
    .getUrl();
```

### Paging

All listing queries support automatic paging. To use automatic paging, use `toAllPromise` extension method:

```typescript
// this executed multiple HTTP requests until it gets all items
const response = await deliveryClient.items().limitParameter(5).toAllPromise();

// only gets 3 pages at maximum
const response = await deliveryClient.items().limitParameter(5).toAllPromise({
    pages: 3
});
```

### Resolving rich text elements

[Rich text elements](https://kontent.ai/learn/reference/delivery-api#section/Rich-text-element) in Kontent.ai may
contain linked items and components. For example, if you write a blog post, you might want to insert a video or
testimonial to a specific place in your article.

To learn how to work with Rich text element have a look at
[@kontent-ai/rich-text-resolver](https://www.npmjs.com/package/@kontent-ai/rich-text-resolver) library.

## Get content types

```typescript
deliveryClient.type('movie').toPromise();
deliveryClient.types().toPromise();
deliveryClient.types().toAllPromise();
```

## Get taxonomies

```typescript
deliveryClient.taxonomy('taxonomyGroupName').toPromise();
deliveryClient.taxonomies().toPromise();
deliveryClient.taxonomies().toAllPromise();
```

## Proxy configuration

If you want to use a proxy server, you need to use a different domain or otherwise transform the URL. By using `proxy`
configuration option you can define your own base domains as well as URL format. This is useful if you need to for
example hide the `environmentId` from the URL.

`IDeliveryClientProxyConfig` offers 3 ways of configuring proxy URL:

1. `baseUrl` - Base URL used for all requests. Defaults to 'deliver.kontent.ai'
2. `basePreviewUrl` - Base url used for preview requests. Defaults to 'preview-deliver.kontent.ai'
3. `advancedProxyUrlResolver` - Resolver function where you get `IProxyUrlData` context data (includes domain, action,
   query parameters..) and can fully customize the final URL.

Examples:

```typescript
const client = createDeliveryClient({
    environmentId: '<YOUR_ENVIRONMENT_ID>',
    // Will be used instead of 'https://deliver.kontent.ai' for all requests.
    // Parameters, filters, project Id and other parts of the URL will use default values.
    proxy: {
        baseUrl: 'http://my-proxy.io'
    }
});
```

```typescript
const client = createDeliveryClient({
    environmentId: '<YOUR_ENVIRONMENT_ID>',
    proxy: {
        advancedProxyUrlResolver: (data) => {
            const action = data.action; // /items
            const domain = data.domain; // https://deliver.kontent.ai
            const environmentId = data.environmentId; // xxx
            const queryString = data.queryString; // e.g. ?depth=1&elements=xElement
            const queryParameters = data.queryParameters; // array with query parameters parameters
            const queryConfig = data.queryConfig; // query configuration
            return `http://my-proxy.io${action}${queryString}`; // proxy URL with omitted project Id
        }
    }
});
```

## Error handling

If the error originates in Kontent.ai (see
[error responses](https://kontent.ai/learn/reference/delivery-api#section/SDKs)), you will get a `DeliveryError` object
instance with more specific information. Otherwise, you will get the original error.

```typescript
import { DeliveryError } from '@kontent-ai/delivery-sdk';

try {
    await deliveryClient.item('invalid_codename').toPromise();
} catch (error) {
    if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.log(err.message, err.errorCode);
    } else {
        // some other error
        console.log(error);
    }
}
```

### Remapping json responses

In some scenarios, you might want to store `json` response for later use and use SDK to map the response for you. There
are 2 ways you can map previously stored `json`:

```typescript
const result = await deliveryClient.item<Movie>('codename').toPromise();
const json = result.response.data;

// approach #1
const remappedData = deliveryClient.mappingService.viewContentItemResponse<Movie>(json);

// approach #2
const remappedData = deliveryClient.item<Movie>(movieCodename).map(json);
```

### Handling circular references

By default, the SDK automatically maps content items present in `linked items` & `rich text` elements. Linked items can
reference other linked items in their tree (e.g. child item referencing parent) which may cause infinite nesting
(circular reference). This behavior is not an issue for most scenarios, in fact it is beneficial as you can easily
access all linked items. However, you cannot easily serialize such model. Using e.g. `JSON.stringify` would fail if
there are circular references.

For this reason, you may disable mapping of linked items with `linkedItemsReferenceHandler` configuration option.

```typescript
const client = getTestDeliveryClient({
    environmentId: '<YOUR_ENVIRONMENT_ID>',
    linkedItemsReferenceHandler: 'ignore' // or 'map'
});
```

### Using custom HTTP service

The SDK allows you to inject your own instance of a class implementing the `IHttpService` interface. This way you can
easily mock responses, implement your own http service, or modify the requests in some other way.

Sample of a test `HttpService` implementation can be found at https://github.com/kontent-ai/core-sdk-js

Once you have your `HttpService`, use it in delivery client initialization:

```typescript
const deliveryClient = createDeliveryClient({
    environmentId: '<YOUR_ENVIRONMENT_ID>',
    httpService: YourHttpServiceImplementation
});
```

## Debugging

### Accessing request data

Every response from this SDK contains additional debug data you can use to inspect when something is not right or if you
need to access response headers or other network related properties.

```typescript
const deliveryResponse = await createDeliveryClient({ environmentId: 'environmentId' })
    .item('itemCodename')
    .toPromise();
const rawResponseData = deliveryResponse.response; // contains raw response data, headers, status etc..
const responseHeaders = deliveryResponse.response.headers;
```

### Getting URL of a query

In case you need to get the raw URL of a request before calling it, use the `getUrl()` method on any query.

```typescript
const queryText = deliveryClient
    .items()
    .type('movie')
    .limitParameter(10)
    .orderParameter('system.codename', 'desc')
    .getUrl();

console.log(queryText);
// outputs:
// https://deliver.kontent.ai/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items?limit=10&order=system.codename[desc]&system.type=movie
```

## Testing

Note: You need to have `Chrome` installed in order to run tests via Karma.

-   `npm run test:browser` Runs tests in Chrome
-   `npm run test:node` Runs tests in node.js
-   `npm run test:all` Runs all test

> If you want to mock http responses, it is possible to use
> [custom Http Service](https://github.com/kontent-ai/core-sdk-js#testing) as a part of the
> [delivery client configuration](#client-configuration).

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.
