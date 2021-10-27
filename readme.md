[![npm version](https://badge.fury.io/js/%40kentico%2Fkontent-delivery.svg)](https://badge.fury.io/js/%40kentico%2Fkontent-delivery)
[![Build](https://github.com/Kentico/kontent-delivery-sdk-js/actions/workflows/test.yml/badge.svg)](https://github.com/Kentico/kontent-delivery-sdk-js/actions/workflows/test.yml)
[![CircleCI](https://circleci.com/gh/Kentico/kontent-delivery-sdk-js/tree/master.svg?style=svg)](https://circleci.com/gh/Kentico/kontent-delivery-sdk-js/tree/master)
[![npm](https://img.shields.io/npm/dt/@kentico/kontent-delivery.svg)](https://www.npmjs.com/package/@kentico/kontent-delivery)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kontent-delivery-sdk-js/badge.svg)](https://snyk.io/test/github/kentico/kontent-delivery-sdk-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kontent-delivery-sdk-js.svg)](https://github.com/Kentico/kontent-delivery-sdk-js)
![Gzip browser bundle](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/_bundles/kontent-delivery.browser.umd.min.js?compression=gzip)
[![](https://data.jsdelivr.com/v1/package/npm/@kentico/kontent-delivery/badge)](https://www.jsdelivr.com/package/npm/kentico-kotent-delivery)

[![Discord](https://img.shields.io/discord/821885171984891914?label=Discord&logo=Discord&logoColor=white)](https://discord.gg/SKCxwPtevJ)

# JavaScript Delivery SDK Documentation

JavaScript Delivery SDK is a client library for retrieving data from [Kontent by Kentico](https://kontent.ai/). Works
both in browser & node.js environments.

# Kontent Delivery SDK

## Installation

You can install this library using `npm` or you can use global CDNs such `jsdelivr`.

### npm

```
npm i @kentico/kontent-delivery --save
```

### UMD Bundles

When using UMD bundle and including this library in `script` tag on your `html` page, you can find it under the
`kontentDelivery` global variable.

Bundles are distributed in `dist/_bundles` folder:

-   `dist/_bundles/kontent-delivery.umd.js`
-   `dist/_bundles/kontent-delivery.umd.min.js`

#### CDN

##### kontent-delivery.umd.js

![Gzip UMD bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-delivery@latest/_bundles/kontent-delivery.umd.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/_bundles/kontent-delivery.browser.umd.min.js
```

##### kontent-delivery.umd.min.js

![Gzip UMD Minified bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-delivery@latest/_bundles/kontent-delivery.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/_bundles/kontent-delivery.umd.min.js
```

## TypeScript & ES6

```typescript
import { IContentItem, Elements, createDeliveryClient } from '@kentico/kontent-delivery';

/**
 * Defining models is optional, but will greatly benefit development
 * experience & further maintenance of your code
 */
export type Movie = IContentItem<{
    title: Elements.TextElement;
    plot: Elements.RichTextElement;
    released: Elements.DateTimeElement;
    length: Elements.NumberElement;
    poster: Elements.AssetsElement;
    category: Elements.MultipleChoiceElement;
    stars: Elements.LinkedItemsElement<Actor>;
    seoname: Elements.UrlSlugElement;
    releaseCategory: Elements.TaxonomyElement;
}>;

// initialize delivery client
const deliveryClient = createDeliveryClient({
    projectId: '<YOUR_PROJECT_ID>'
});

// fetch items
const response = await deliveryClient.items<Movie>().type('<CONTENT_TYPE_CODENAME>').toPromise();

// read data of first item
const movieText = response.data.items[0].title.value;
```

## JavaScript & CommonJS

```javascript
const KontentDelivery = require('@kentico/kontent-delivery');

// initialize delivery client
const deliveryClient = KontentDelivery.createDeliveryClient({
  projectId: '<YOUR_PROJECT_ID>',
});

// fetch items
const response = await deliveryClient.items()
  .type('<CONTENT_TYPE_CODENAME>')
  .toPromise();

// read data of first item
const movieText = response.data.items[0].title.value;
```

## HTML & UMD & CDN

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Kontent SDK - Html sample</title>
        <script
            type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/@kentico/kontent-delivery/dist/bundles/kontent-delivery.umd.min.js"
        ></script>
    </head>
    <body>
        <script type="text/javascript">
            var KontentDelivery = window['kontentDelivery'];

            var deliveryClient = KontentDelivery.createDeliveryClient({
                projectId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9'
            });

            deliveryClient
                .items()
                .type('movie')
                .toPromise()
                .then((response) => console.log(response));
        </script>
        <h1>See console</h1>
    </body>
</html>
```

## SDK Documentation

## Client configuration

Following is a list of configuration options for DeliveryClient (`IDeliveryClientConfig`):

| Property            |                   type                   | description                                                                                                                          |
| ------------------- | :--------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------ |
| projectId           |                  string                  | ProjectId of your Kontent project                                                                                                    |
| elementResolver?    |             ElementResolver              | Element resolver used to map custom elements                                                                                         |
| previewApiKey?      |                  string                  | Preview API key used to get unpublished content items                                                                                |
| defaultLanguage?    |                  string                  | Sets default language that will be used for all queries unless overriden with query parameters                                       |
| proxy?              |        IDeliveryClientProxyConfig        | Can be used to configure custom URLs. Useful when you use reverse proxy or have a need to transform URL - e.g. to remove 'projectId' |
| secureApiKey?       |                  string                  | Secured API key: Use secured API only when running on Node.JS server, otherwise you can expose your key                              |
| defaultQueryConfig? |               IQueryConfig               | Default configuration for all queries. Can be overriden by indidividual queries                                                      |
| httpService ?       |               IHttpService               | Can be used to inject custom http service for performing requests                                                                   |
| globalHeaders?      | (queryConfig: IQueryConfig) => IHeader[] | Adds ability to add extra headers to each http request                                                                               |
| retryStrategy?      |          IRetryStrategyOptions           | Retry strategy configuration                                                                                                         |
| linkedItemsReferenceHandler?      |          LinkedItemsReferenceHandler           | Indicates if content items are automatically mapped. Available values: 'map' or 'ignore'                                                                                                         |
| propertyNameResolver?      |          PropertyNameResolver           | Used to map properties. Choose one of following default resolvers: `snakeCasePropertyNameResolver`, `pascalCasePropertyNameResolver` & `camelCasePropertyNameResolver` or create your own PropertyNameResolver function                                                                                                        |

### Create typed models

You may define optional models in Typescript representing your actual data defined in Kontent projects. You can also
auto-generate these models (see below).

```typescript
import { IContentItem, Elements } from '@kentico/kontent-delivery';

export type Movie = IContentItem<{
    title: Elements.TextElement;
    plot: Elements.RichTextElement;
    released: Elements.DateTimeElement;
    length: Elements.NumberElement;
    poster: Elements.AssetsElement;
    category: Elements.MultipleChoiceElement;
    stars: Elements.LinkedItemsElement<Actor>;
    seoname: Elements.UrlSlugElement;
    releaseCategory: Elements.TaxonomyElement;
}>;
```

### Fetch data

To get multiple content items, use the `items` method. You can specify the content type with the `type` method:

```typescript
deliveryClient.items<Movie>().type('typeCodename').toPromise();

deliveryClient.item<Movie>('itemCodename').toPromise();
```

Supported elements: `TextElement`, `MultipleChoiceElement`, `DateTimeElement`, `RichTextElement`, `NumberElement`,
`AssetsElement`, `UrlSlugElement`, `TaxonomyElement`, `LinkedItemsElement` and `CustomElement`. Additionally you might
also get `UknownElement` or custom model if you register it for your custom elements.

#### Use custom models for Custom elements

You can register an `ElementResolver` to map custom elements into dedicated element models and work with data more
effectively.

For example, if you have a custom `color` element in your Kontent project with json data like:

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
import { ElementModels, Elements, createDeliveryClient } from '@kentico/kontent-delivery';

type ColorElement = Elements.CustomElement<{
    red: number;
    green: number;
    blue: number;
}>;
```

To resolve your custom element into `ColorElement`, use the `ElementResolver` in your dleivery client config:

```typescript
const client = createDeliveryClient({
    projectId: '<YOUR_PROJECT_ID>',
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

:heavy_check_mark: **Save time by auto-generating models**

Use the [Kontent Model Generator](https://www.npmjs.com/package/@kentico/kontent-model-generator) to automatically
generate TypeScript models based on the content types in your Kontent project.

### Query parameters

The SDK supports the following query parameters: `depthParameter`, `elementsParameter`, `limitParameter`,
`orderParameter`, `skipParameter` and `languageParameter`. For more information about the parameters, see the
[SDK query methods](#filter-content) below. You can also head over to
[Delivery API reference](https://docs.kontent.ai/reference/delivery-api#tag/Filtering-content).

```typescript
// Gets 5 items based on the Movie type
deliveryClient.items<Movie>().type('movie').limitParameter(5).skipParameter(2).toPromise();
```

#### Filter content

This example returns all **Movie** content items whose **title** element is equal to **Warrior**. Filters are also
considered query parameters and can be combined. See
[Content filtering in API reference](https://docs.kontent.ai/reference/delivery-api#tag/Filtering-content) for more
general examples.

Supported filters: `type`, `types`, `allFilter`, `anyFilter`, `containsFilter`, `equalsFilter`, `greaterThanFilter`,
`greaterThanOrEqualFilter`, `infilter`, `lessThanFilter`, `lessThanOrEqualFilter`, `rangeFilter`, `emptyFilter`,
`notEmptyFilter`, `notEqualsFilter`, `NotInFilter`.

```typescript
// Gets items based on the Movie type with 'Warrior' in their 'Title' element
deliveryClient.items<Movie>().type('movie').equalsFilter('elements.title', 'Warrior').toPromise();
```

##### Filtering methods

| Filter                   | Description                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------- |
| type                     | Retrieve only content items based on the given type.                                  |
| types                    | Retrieve only content items based on the given types.                                 |
| allFilte                 | Element with an array of values contains the specified list of values.                |
| anyFilter                | Element with an array of values contains any value from the specified list of values. |
| containsFilter           | Element with an array of values contains the specified value.                         |
| equalsFilter             | Element value is the same as the specified value                                      |
| greaterThanFilter        | Element value is greater than the specified value.                                    |
| greaterThanOrEqualFilter | Element value is greater than or equals the specified value.                          |
| infilter                 | Element value is in the specified list of values.                                     |
| lessThanFilter           | Element value is less than the specified value.                                       |
| lessThanOrEqualFilter    | Element value is less than or equals the specified value                              |
| rangeFilter              | Element value falls in the specified range of two values, both inclusive.             |
| emptyFilter              | Property value is empty.                                                              |
| NotEmptyFilter           | Property value is not empty.                                                          |
| notEqualsFilter          | Property value does not equal the specified value.                                    |
| notInFilter              | Property value is not in the specified list of values.                                |

#### Sort content

You can sort data by using any of following methods:

```typescript
deliveryClient.items<Movie>().type('movie').orderByDescending('elements.title').toPromise();
```

```typescript
deliveryClient.items<Movie>().type('movie').orderByAscending('elements.title').toPromise();
```

```typescript
deliveryClient.items<Movie>().type('movie').orderParameter('elements.title', 'desc').toPromise();
```

### Execute queries with custom URL

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

You can specify [language of items](https://docs.kontent.ai/tutorials/manage-kontent/projects/set-up-languages) with
`languageParameter` of a particular query. You can also define default language that will be used if `languageParameter`
is not used during the initialization of delivery client.

```typescript
import { createDeliveryClient } from '@kentico/kontent-delivery';

var deliveryClient = new createDeliveryClient({
    projectId: '<YOUR_PROJECT_ID>',
    defaultLanguage: 'es'
});

// Gets items in 'es' language because it is marked as default
deliveryClient.item('warrior').toPromise();

// Gets items in 'en' language because language parameter has priority over the default one
deliveryClient.item('warrior').languageParameter(`en`).toPromise();
```

### Property name resolvers

Kontent element codenames are always in **lowercase** and use **underscore** as a replacement for special characters.
Using underscores might not be what you want to use in your code. Maybe you want to use `camelCase`, which is exactly
what you can do by registering a `propertyNameResolver`. The following example converts `first_name` element name to
`firstName`.

```typescript
import { ContentItem, Elements, createDeliveryClient  } from '@kentico/kontent-delivery';

type Actor = IContentItem<{
    firstName: Elements.TextElement;
}>;

const deliveryClient = createDeliveryClient({
  projectId: '<YOUR_PROJECT_ID>';
  propertyNameResolver: (contentType, element) => {
    if (element === 'first_name') {
        return 'firstName';
    }
    return element;
    }
});
```

Rather then registering all elements manually, you can also use one of the built-in property name resolvers: `snakeCasePropertyNameResolver`, `pascalCasePropertyNameResolver` & `camelCasePropertyNameResolver`

```typescript
import { createDeliveryClient, snakeCasePropertyNameResolver, pascalCasePropertyNameResolver, camelCasePropertyNameResolver  } from '@kentico/kontent-delivery';

const deliveryClient = createDeliveryClient({
  projectId: '<YOUR_PROJECT_ID>';
  propertyNameResolver: camelCasePropertyNameResolver,
  // propertyNameResolver: snakeCasePropertyNameResolver,
  // propertyNameResolver: pascalCasePropertyNameResolver,
});
```

### Preview mode

You can enable the preview mode either globally (when [initializing the DeliveryClient](#how-to-use-deliveryclient)) or
per query. In each case, you need to set `previewApiKey` in the delivery client global configuration.

#### Enable preview mode globally

```typescript
import { createDeliveryClient } from '@kentico/kontent-delivery';

const deliveryClient = createDeliveryClient({
  projectId: '<YOUR_PROJECT_ID>';
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
[secure access](https://docs.kontent.ai/tutorials/develop-apps/build-strong-foundation/restrict-public-access) enabled
is recommend only when the request is not being executed on the client (browser) because otherwise you will expose the
API key publicly.

```typescript
import { createDeliveryClient } from '@kentico/kontent-delivery';

const deliveryClient = createDeliveryClient({
  projectId: '<YOUR_PROJECT_ID>';
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

Use `ImageUrlBuilder` for your [image transformations](https://docs.kontent.ai/reference/image-transformation) on asset
URLs.

```typescript
import { transformImageUrl } from '@kentico/kontent-delivery';

// Sample asset URL; You'll find URLs like these in asset and rich text elements
const assetUrl = `https://assets.kenticocloud.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/22504ba8-2075-48fa-9d4f-8fce3de1754a/warrior.jpg`;

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
```

Alternatively, you may also specify maximum number of pages you want to get:

```typescript
// only gets 3 page at maximum
const response = await deliveryClient.items().limitParameter(5).toAllPromise({
    pages: 3
});
```

### Resolving rich text elements

[Rich text elements](https://docs.kontent.ai/reference/kentico-kontent-apis-overview#section-rich-text-element) in
Kontent by Kentico may contain linked items and components. For example, if you write a blog post, you might want to
insert a video or testimonial to a specific place in your article.

You need to define how these objects resolve to the HTML that will be rendered. This SDK provides you with few resolvers
that help you to transform the input HTML to your desired HTML, JSON or object. 

Built-in resolvers provided by SDK:

Resolver | Description | Usage
--- | --- | --- |
`RichTextHtmlResolver` | Tranforms rich text HTML by replacing linked items, links or images with custom HTML | `createRichTextHtmlResolver().resolveRichText(data)`
`RichTextJsonResolver` | Tranforms rich text HTML into JSON | `createRichTextJsonResolver().resolveRichText(data)`
`RichTextObjectResolver` | Tranforms rich text HTML into javascript Object | `createRichTextObjectResolver().resolveRichText(data)`
`AsyncRichTextHtmlResolver` | Async version of `RichTextHtmlResolver` | `await createAsyncRichTextHtmlResolver().resolveRichTextAsync(data)`

#### Example use of RichTextHtmlResolver

```typescript
import { createRichTextHtmlResolver, createDeliveryClient, linkedItemsHelper } from '@kentico/kontent-delivery';

export type Movie = IContentItem<{
    plot: Elements.RichTextElement;
}>;

export type Actor = IContentItem<{
    firstName: Elements.RichTextElement;
}>;

// get content item with rich text element
const response = (await createDeliveryClient({ projectId: '<YOUR_PROJECT_ID>' }).item<Movie>('itemCodename').toPromise()).data;

// get rich text element
const richTextElement = response.item.plot;

// resolve HTML
const resolvedRichText = createRichTextHtmlResolver().resolveRichText({
    element: richTextElement,
    linkedItems: linkedItemsHelper.convertLinkedItemsToArray(response.linkedItems),
    imageResolver: (image) => {
        return {
            imageHtml: `<img class="xImage" src="${image?.url}">`,
            // alternatively you may return just url
            url: 'customUrl'
        };
    },
    urlResolver: (link) => {
        return {
            linkHtml: `<a class="xLink">${link?.link?.urlSlug}</a>`,
            // alternatively you may return just url
            url: 'customUrl'
        };
    },
    contentItemResolver: (contentItem) => {
        if (contentItem && contentItem.system.type === 'actor') {
            const actor = contentItem as Actor;
            return {
                contentItemHtml: `<div class="xClass">${actor.elements.firstName.value}</div>`
            };
        }

        return {
            contentItemHtml: ''
        };
    }
});

const resolvedHtml = resolvedRichText.html;
```

#### Example use of RichTextJsonResolver

```typescript
import { createRichTextHtmlResolver, createDeliveryClient, linkedItemsHelper } from '@kentico/kontent-delivery';

// get content item with rich text element
const response = (await createDeliveryClient({ projectId: '<YOUR_PROJECT_ID>' }).item<Movie>('itemCodename').toPromise()).data;

// get rich text element
const richTextElement = response.item.plot;

// transform rich text html into json
const json = createRichTextJsonResolver().resolveRichText({
    element: response.item.elements.plot,
    linkedItems: linkedItemsHelper.convertLinkedItemsToArray(response.linkedItems),
});
```

#### Resolving rich text in node.js

If you need to resolve rich text in `node.js`, you have to install following parser:

```
npm i @kentico/kontent-delivery-node-parser --save
```

Once installed, it can be used by passing the parser to rich text resolver:

```typescript
import { createRichTextHtmlResolver, createAsyncRichTextHtmlResolver } from '@kentico/kontent-delivery';
import { nodeParser, asyncNodeParser } from '@kentico/kontent-delivery-node-parser';

// transform rich text html into json
const json = createRichTextHtmlResolver(nodeParser).resolveRichText(data);

// or
const html = await createAsyncRichTextHtmlResolver(asyncNodeParser).resolveRichText(data);
```

## Get content types

To retrieve information about your content types, you can use the `type` and `types` methods.

```typescript
deliveryClient
    .type('movie') // codename of the type
    .toPromise();

deliveryClient.types().toPromise();

deliveryClient.types().toAllPromise();
```

## Get taxonomies

To retrieve information about your taxonomies, you can use the `taxonomy` and `taxonomies` methods.

```typescript
deliveryClient
    .taxonomy('taxonomyGroupName') // codename of the Taxonomy group
    .toPromise();

deliveryClient.taxonomies().toPromise();

deliveryClient.taxonomies().toAllPromise();
```

## Proxy configuration

If you want to use a proxy server, you need to use different domain or otherwise transform URL. By using `proxy`
configuration option you can define your own base domains as well as URL format. This is useful if you need to for
example hide the `projectId` from URL.

`IDeliveryClientProxyConfig` offers 3 ways of configuring proxy url:

1. `baseUrl` - Base url used for preview reqeusts. Defaults to 'preview-deliver.kontent.ai'
2. `basePreviewUrl` - Base url used for all requests. Defaults to 'deliver.kontent.ai'
3. `advancedProxyUrlResolver` - Resolver function where you get `IProxyUrlData` context data (includes domain, action,
   query parameters..) and can fully customize final URL.

Examples:

```typescript
const client = createDeliveryClient({
    projectId: '<YOUR_PROJECT_ID>',
    // Will be used instead of 'https://deliver.kontent.ai' for all requests.
    // Parameters, filters, project Id and other parts of URL will use default values.
    proxy: {
        baseUrl: 'http://my-proxy.io'
    }
});
```

```typescript
const client = createDeliveryClient({
    projectId: '<YOUR_PROJECT_ID>',
    proxy: {
        advancedProxyUrlResolver: (data) => {
            const action = data.action; // /items
            const domain = data.domain; // https://deliver.kontent.ai
            const projectId = data.projectId; // xxx
            const queryString = data.queryString; // e.g. ?depth=1&elements=xElement
            const queryParameters = data.queryParameters; // array with query parameters parameters
            const queryConfig = data.queryConfig; // query configuration
            return `http://my-proxy.io${action}${queryString}`; // proxy url with omitted project Id
        }
    }
});
```

## Error handling

If the error originates in Kontent by Kentico (see
[error responses](https://docs.kontent.ai/reference/delivery-api#section/Errors)), you will get a `DeliveryError` object
instance with more specific information. Otherwise, you will get original error.

```typescript
import { DeliveryError } from '@kentico/kontent-delivery';

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

In some scenarios you might want to store `json` response for later use and use SDK to map the response for you. There are 2 ways you can map previously stored `json`:

```typescript
const result = await deliveryClient.item<Movie>('codename').toPromise();

const json = result.response.data;

// approach #1
const remappedData = deliveryClient.mappingService.viewContentItemResponse<Movie>(json);

// approach #2
const remappedData = deliveryClient.item<Movie>(movieCodename).map(json);
```

### Handling circular references

By default the SDK automatically maps content items present in `linked items` & `rich text` elements. Linked items can reference other linked items in their tree (e.g. child item referencing parent) which may cause infinite nesting (circular reference). This behavior is not an issue for most scenarios, in fact it is beneficial as you can easily access all linked items. However, you cannot easily serialize such model. Using e.g. `JSON.stringify` would fail if there are circular references. 

For this reason, you may disable mapping of linked items with `linkedItemsReferenceHandler` configuration option.

```typescript
 const client = getTestDeliveryClient({
    projectId: '<YOUR_PROJECT_ID>',
    linkedItemsReferenceHandler: 'ignore' // or 'map'
});
```

### Using custom HTTP service

The SDK allows you to inject your own instance of a class implementing the `IHttpService` interface. This way you can
easily mock responses, implement your own http service, or modify the requests in some other way.

Sample of a test `HttpService` implementation can be found at
https://github.com/Kentico/kontent-core-js/blob/7ec7faaa779a4aa55802ade927f296cc3619a720/lib/http/test-http.service.ts

Once you have your `HttpService`, use it in delivery client initialization:

```typescript
const deliveryClient = createDeliveryClient({
    projectId: '<YOUR_PROJECT_ID>',
    httpService: YourHttpServiceImplementation
});
```


## Debugging

### Accessing request data

Every response from this SDK contains additional debug data you can use to inspect when something is not right or if you
need to access response headers or other network related properties.

```typescript
const deliveryResponse = await createDeliveryClient({ projectId: '<YOUR_PROJECT_ID' }).item('itemCodename').toPromise();
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
## Upgrade

The major version `11.0.0` is pretty much a complete overhaul of this SDK with many breaking changes. The major benefits
you can with `11.0.0` are:

-   Greatly reduced package size (from `~318KB` to `~95KB`). When Gzipped, this library is now only `~19KB`
-   Reduced complexity by removing `rxjs` as not everyone needs to use it
-   Removed classes in favor of interfaces (again to reduce size of library)
-   Automatic paging support for all listing queries
-   Improved resolving of rich text elements along with the `async` support
-   Simplified custom models without the need of `typeResolvers`
-   Better retry strategy options
-   More extension methods added for all queries that support it (feed listing, content type listing etc..)
-   Removal of duplicate `raw` data to reduce the size of mapped responses while still being able to easily access debug
    data with typed network response
-   Simplified mapping of `json` data to SDK response (when you for example store `json` in cache and need to re-map it
    later on)
-   Updated all dependencies

If you are upgrading from older version, please see this documentation first. If you are still unsure how to upgrade or
have some other questions, feel free to submit an issue on this GitHub and we'll get back to you.

## Testing

Note: You need to have `Chrome` installed in order to run tests via Karma.

-   `npm run test:browser` Runs tests in Chrome
-   `npm run test:node` Runs tests in node.js
-   `npm run test:all` Runs all test

> If you want to mock http responses, it is possible to use
> [custom Http Service](https://github.com/Kentico/kontent-core-js#testing) as a part of the
> [delivery client configuration](#client-configuration).

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.
