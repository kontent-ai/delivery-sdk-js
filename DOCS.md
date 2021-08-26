# JavaScript Delivery SDK Documentation

JavaScript Delivery SDK is a client library for retrieving content from [Kentico Kontent](https://kontent.ai/) using Delivery API. The client library is written in TypeScript and published in formats `UMD`, `ES2015`, and `CommonJs`. It works both in browser & node.

- [JavaScript Delivery SDK Documentation](#javascript-delivery-sdk-documentation)
  - [Installation](#installation)
    - [npm](#npm)
    - [UMD Bundles](#umd-bundles)
      - [CDN](#cdn)
        - [kontent-delivery.browser.legacy.umd.min](#kontent-deliverybrowserlegacyumdmin)
        - [kontent-delivery.browser.umd.min](#kontent-deliverybrowserumdmin)
        - [kontent-delivery.umd.min](#kontent-deliveryumdmin)
  - [Upgrade](#upgrade)
  - [TypeScript & ES6](#typescript--es6)
  - [JavaScript & CommonJS](#javascript--commonjs)
  - [HTML & UMD & CDN](#html--umd--cdn)
  - [SDK Documentation](#sdk-documentation)
    - [Get data as Promise (recommended)](#get-data-as-Promise-recommended)
    - [Get data as Promise](#get-data-as-promise)
    - [Create typed models](#create-typed-models)
      - [Use custom models for Custom elements](#use-custom-models-for-custom-elements)
    - [How to use DeliveryClient](#how-to-use-deliveryclient)
    - [Use query parameters to get what you want](#use-query-parameters-to-get-what-you-want)
      - [Filter content](#filter-content)
        - [Filtering methods](#filtering-methods)
      - [Sort content](#sort-content)
    - [Execute queries with custom URL](#execute-queries-with-custom-url)
    - [Custom parameters](#custom-parameters)
    - [Get localized items](#get-localized-items)
    - [Property binding in models](#property-binding-in-models)
    - [Preview mode](#preview-mode)
      - [Enable preview mode globally](#enable-preview-mode-globally)
      - [Enable preview mode per query](#enable-preview-mode-per-query)
    - [Secured Delivery API mode](#secured-delivery-api-mode)
    - [Image transformation](#image-transformation)
    - [URL Slugs (links)](#url-slugs-links)
      - [Resolve URL slugs globally](#resolve-url-slugs-globally)
      - [Resolve URL slugs on query level](#resolve-url-slugs-on-query-level)
      - [Resolve URL slugs as HTML](#resolve-url-slugs-as-html)
    - [Resolve content items and components in Rich text elements](#resolve-content-items-and-components-in-rich-text-elements)
      - [Globally](#globally)
      - [Locally per query](#locally-per-query)
    - [Strongly typed nested items](#strongly-typed-nested-items)
    - [Handle missing references to linked items](#handle-missing-references-to-linked-items)
    - [Custom resolving for content items](#custom-resolving-for-content-items)
    - [Image processing inside Rich Text elements](#image-processing-inside-rich-text-elements)
  - [Get content types](#get-content-types)
  - [Get taxonomies](#get-taxonomies)
  - [Client configuration](#client-configuration)
  - [Proxy configuration](#proxy-configuration)
  - [Error handling](#error-handling)
  - [Debugging](#debugging)
    - [Accessing request data](#accessing-request-data)
    - [Getting URL of a query](#getting-url-of-a-query)
    - [Using custom HTTP service](#using-custom-http-service)
  - [Feedback & Contribution](#feedback--contribution)

## Installation

You can install this library using `npm` or you can use global CDNs such as `unpkg` and `jsdelivr` directly.

### npm

```shell
npm i @kentico/kontent-delivery --save
```

### UMD Bundles

When using UMD bundle and including this library in the `script` tag on your HTML page, you can find it under the `kontentDelivery` global variable.

Bundles are distributed in the `_bundles` folder. You can choose from several bundle options.

- Use `kontent-delivery.browser.legacy.umd.min` if you need to support legacy browsers (IE9, IE10, IE11).
- Use `kontent-delivery.browser.umd.min` if you intend to use SDK only in browsers (strips code specific to Node.js = smaller bundle).
- Use `kontent-delivery.umd.min` if you need to use it in Node.js.

#### CDN

##### kontent-delivery.browser.legacy.umd.min

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-delivery@latest/_bundles/kontent-delivery.browser.legacy.umd.min.js?compression=gzip)

```http
https://cdn.jsdelivr.net/npm/kentico-kontent-delivery/_bundles/@kentico/kontent-delivery.browser.legacy.umd.min.js
```

##### kontent-delivery.browser.umd.min

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-delivery@latest/_bundles/kontent-delivery.browser.umd.min.js?compression=gzip)

```http
https://cdn.jsdelivr.net/npm/kentico-kontent-delivery/_bundles/@kentico/kontent-delivery.browser.umd.min.js
```

##### kontent-delivery.umd.min

![Gzip full bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-delivery@latest/_bundles/kontent-delivery.umd.min.js?compression=gzip)

```http
https://cdn.jsdelivr.net/npm/kentico-kontent-delivery/_bundles/@kentico/kontent-delivery.umd.min.js
```

## Upgrade

If you are upgrading from SDK versions 5.x.y or older, see [upgrade guide](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/UPGRADE.md).

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
deliveryClient.items<Movie>()
    .type('movie')
    .toPromise()
    .then(response => {
        const movieText = response.items[0].title.value;
    )
});

/** Getting items from Kentico Kontent as Promise */
deliveryClient.items<Movie>()
    .type('movie')
    .toPromise()
    .subscribe(response => {
        const movieText = response.items[0].title.value;
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
    console.log(response.items[0].title.value);
});

```

## JavaScript & CommonJS

```javascript
const KenticoContent = require('@kentico/kontent-delivery');

class Movie extends KenticoContent.ContentItem {
    constructor() {
        super();
    }
}

const deliveryClient = new KenticoContent.DeliveryClient({
    projectId: 'xxx',
    typeResolvers: [
        new KenticoContent.TypeResolver('movie', () => new Movie()),
    ]
});

/** Getting items from Kentico Kontent as Promise */
deliveryClient.items()
    .type('movie')
    .toPromise()
    .then(response => {
        const movieText = response.items[0].title.value;
    )
});

/** Getting items from Kentico Kontent as Promise */
const subscription = deliveryClient.items()
    .type('movie')
    .toPromise()
    .subscribe(response => {
        const movieText = response.items[0].title.value;
    });

/*
Don't forget to unsubscribe from your Promises. You can use 'takeUntil' or 'unsubscribe' method for this purpose. Unsubsription is usually done when you no longer need to process the result of Promise. (Example: 'ngOnDestroy' event in Angular app)
*/
subscription.unsubscribe();

/**
 * Fetch all items of 'movie' type and given parameters from Kentico Kontent.
 * Important note: SDK will convert items to your type if you registered it. For example,
 * in this case the objects will be of 'Movie' type we defined above.
 * If you don't use custom models, 'ContentItem' object instances will be returned.
 */
deliveryClient.items()
    .type('movie')
    .toPromise()
    .subscribe(response => console.log(response));
```

## HTML & UMD & CDN

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

## SDK Documentation

### Get data as Promise (recommended)

To get multiple content items, use the `items` method. You can specify the content type with the `type` method:

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .toPromise();

deliveryClient.item<Movie>('warrior')
  .toPromise();
```

### Create typed models

Every content type in Kontent needs to have a corresponding class defined in both JavaScript & TypeScript. Each model class needs to extend the `ContentItem` class and each element needs to use one of the supported elements. For example, if you define a text element in your content type, you need to use a `TextElement` in your model:

```typescript
import { ContentItem, Elements} from '@kentico/kontent-delivery';

export class Movie extends ContentItem {
  public title: Elements.TextElement;
  public plot: Elements.RichTextElement;
  public released: Elements.DateTimeElement;
  public length: Elements.NumberElement;
  public poster: Elements.AssetsElement;
  public category: Elements.MultipleChoiceElement;
  public stars: Elements.LinkedItemsElement;
}
```

Supported elements: `TextElement`, `MultipleChoiceElement`, `DateTimeElement`, `RichTextElement`, `NumberElement`, `AssetsElement`, `UrlSlugElement`, `TaxonomyElement`, `LinkedItemsElement` and `DefaultCustomElement`. Additionally you might also get `UknownElement` or custom model if you register it for your custom elements instead of `DefaultCustomElement`.

#### Use custom models for Custom elements

You can register an `ElementResolver` to map custom elements into dedicated element models and work with data more effectively.

For example, you can have a custom 'color' element defined like following.

```json
 "color": {
  "type": "custom",
  "name": "Color",
  "value": "{\"red\":167,\"green\":96,\"blue\":197}"
  }
```

You can create a `ColorElement` class that extends `CustomElement` (or a class that implements the `IElement` interface) and extract color values into dedicated properties (red, green, blue) so that they are easily accessible.

```typescript
import { ElementModels, Elements } from '@kentico/kontent-delivery';

class ColorElement extends Elements.CustomElement {

    public red: number;
    public green: number;
    public blue: number;

    constructor(
       public elementWrapper: ElementModels.IElementMapWrapper
    ) {
      super(elementWrapper);

      const value = elementWrapper.rawElement.value; // "{\"red\":167,\"green\":96,\"blue\":197}"
      const parsed = JSON.parse(value);
      this.red = parsed.red;
      this.green = parsed.green;
      this.blue = parsed.blue;
    }
}
```

To register mapping of custom elements, use the `ElementResolver` configuration option:

```typescript
const client = new DeliveryClient(
  {
    projectId: '',
    elementResolver: (elementWrapper: ElementModels.IElementMapWrapper) => {
      if (elementWrapper.contentItemSystem.type === 'your-content-type' && elementWrapper.rawElement.name === 'your-element-name') {
        return new ColorElement(elementWrapper);
      }

      return undefined;
    }
  }
);
```

Custom elements are only supported in the latest version of the JavaScript SDK.

:heavy_check_mark: **Save time by auto-generating models**

Use the [Kontent Model Generator](https://www.npmjs.com/package/@kentico/kontent-model-generator) to automatically generate TypeScript or JavaScript models based on the content types in your Kentico Kontent project.

### How to use DeliveryClient

To retrieve data from your Kontent project, you first need to initialize the Delivery client.

```typescript
import { DeliveryClient, TypeResolver } from '@kentico/kontent-delivery';
import { Movie } from './movie'; // use your own path to movie class model

// Initializes DeliveryClient for a specific project
const deliveryClient = new DeliveryClient(
  projectId: '<YOUR_PROJECT_ID>',
  typeResolver: [
    new TypeResolver('movie', () => new Movie())
  ]
)
```

Once you initialize the delivery client for your project, you can use its methods to, for example, get a list of movies.

```typescript
// Gets content items based on the Movie type
deliveryClient.items<Movie>()
  .type('movie')
  .toPromise()
  .subscribe(response => console.log(response));
```

If you need to retrieve hundreds or thousands of items, we recommend using the `itemsFeedAll` method. Unlike the `items` method, the `itemsFeedAll` method is not subject to [API limitations](https://docs.kontent.ai/reference/delivery-api#tag/API-limitations) of the Delivery API and guarantees retrieving all items matching your query.

```typescript
// Gets content items based on the Movie type
deliveryClient.itemsFeedAll<Movie>(
  .type('movie')
  .toPromise()
  .pipe(
    map(response => {
        // do something with feeds response
    })
  )
  .subscribe();
```

You can also use the `itemsFeed` method if you want to retrieve only a few pages of the feed and not everything. The `itemsFeedAll` method handles paging for you and guarantees you get all content items.

### Use query parameters to get what you want

To retrieve specific items, you can combine several query parameters. The SDK supports the following query parameters: `depthParameter`, `elementsParameter`, `limitParameter`, `orderParameter`, `skipParameter` and `languageParameter`. For more information about the parameters, see the [SDK query methods](#filter-content) below. You can also head over to [Delivery API reference](https://docs.kontent.ai/reference/delivery-api#tag/Filtering-content).

```typescript
// Gets 5 items based on the Movie type
deliveryClient.items<Movie>()
  .type('movie')
  .limitParameter(5)
  .skipParameter(2)
  .toPromise()
  .subscribe(response => console.log(response));
```

#### Filter content

This example returns all **Movie** content items whose **title** element is equal to **Warrior**. Filters are also considered query parameters and can be combined. See [Content filtering in API reference](https://docs.kontent.ai/reference/delivery-api#tag/Filtering-content) for more general examples.

Supported filters:  `type`,  `types`, `allFilter`, `anyFilter`, `containsFilter`, `equalsFilter`, `greaterThanFilter`, `greaterThanOrEqualFilter`, `infilter`, `lessThanFilter`, `lessThanOrEqualFilter`, `rangeFilter`, `emptyFilter`, `notEmptyFilter`, `notEqualsFilter`, `NotInFilter`.

```typescript
// Gets items based on the Movie type with 'Warrior' in their 'Title' element
deliveryClient.items<Movie>()
  .type('movie')
  .equalsFilter('elements.title', 'Warrior')
  .toPromise()
  .subscribe(response => console.log(response));
```

##### Filtering methods

| Filter  | Description |
| ------ | ----------- |
| type | Retrieve only content items based on the given type. |
| types | Retrieve only content items based on the given types. |
| allFilte | Element with an array of values contains the specified list of values. |
| anyFilter | Element with an array of values contains any value from the specified list of values. |
| containsFilter | Element with an array of values contains the specified value. |
| equalsFilter | Element value is the same as the specified value |
| greaterThanFilter | Element value is greater than the specified value. |
| greaterThanOrEqualFilter | | Element value is greater than or equals the specified value. |
| infilter | Element value is in the specified list of values. |
| lessThanFilter | Element value is less than the specified value. |
| lessThanOrEqualFilter | Element value is less than or equals the specified value |
| rangeFilter | Element value falls in the specified range of two values, both inclusive. |
| emptyFilter  | Property value is empty.  |
| NotEmptyFilter | Property value is not empty. |
| notEqualsFilter | Property value does not equal the specified value. |
| notInFilter | Property value is not in the specified list of values. |

#### Sort content

You can sort using one of the 3 methods: `OrderByAscending`, `OrderByDescending`, or `OrderBy` with sort order as a string enum.

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .orderByDescending('elements.title')
  .toPromise()
  .subscribe(response => console.log(response));
```

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .orderByAscending('elements.title')
  .toPromise()
  .subscribe(response => console.log(response));
```

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .orderParameter('elements.title', SortOrder.desc)
  .toPromise()
  .subscribe(response => console.log(response));
```

### Execute queries with custom URL

When you have an URL (i.e. for `next page` in paging, for testing purposes or just if you prefer to build it on your own) and still want to leverage SDK functionality such as type mapping, property resolving etc., use `withUrl` parameter on any query such as:

```typescript
deliveryClient.items<Movie>()
  .withUrl('https://deliver.kontent.ai/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items?system.type=movie')
  .toPromise()
  .subscribe(response => console.log(response));
```

### Custom parameters

In case you need to use custom parameters to build up an URL, use `withParameter` method:

```typescript
deliveryClient.items<Movie>()
  .withParameter('customParam', 'customVal')
  .toPromise()
  .subscribe(response => console.log(response));
```

### Get localized items

You can specify the [language of items](https://docs.kontent.ai/tutorials/manage-kontent/projects/set-up-languages) with `languageParameter` of a particular query. You can also specify default language that will be used if `languageParameter` is not used during the initialization of delivery client.

```typescript
import { DeliveryClient } from '@kentico/kontent-delivery';
import { Movie } from './movie'; // use your own path to movie class model

var deliveryClient = new DeliveryClient({
  projectId: '<YOUR_PROJECT_ID>',
  defaultLanguage: 'es'
});

// Gets items in 'es' language because it is marked as default
deliveryClient.item<Movie>('warrior')
  .toPromise()
  .subscribe(response => console.log(response));

// Gets items in 'en' language because language parameter has priority over the default one
deliveryClient.item<Movie>('warrior')
  .languageParameter(`en`)
  .toPromise()
  .subscribe(response => console.log(response));
```

### Property binding in models

Kentico Kontent returns all element names in **lowercase** or with **underscores**. You can bind original element names to your own javascript properties with `ElementDecorators`. The following example binds `first_name` element name to `firstName` javascript property.

```typescript
import { ContentItem, Elements, ElementDecorators  } from '@kentico/kontent-delivery';

export class Actor extends ContentItem {

  @ElementDecorators.codename('first_name')
  public firstName: Elements.TextElement;
  public lastName: Elements.TextElement;
  public bio: Elements.RichTextElement;

    constructor() {
    super({
      propertyResolver: ((elementName: string) => {
        if (elementName === 'lastname') {
          return 'lastName';
        }
        return elementName;
      })
    });
  }
}
```

### Preview mode

You can enable the preview mode either globally (when [initializing the DeliveryClient](#how-to-use-deliveryclient)) or per query. For example, you might disable preview mode globally, but enable it for one query for testing purposes. In each case, you need to set `previewApiKey` in the delivery client global configuration.

#### Enable preview mode globally

```typescript
import { DeliveryClient } from '@kentico/kontent-delivery';

const deliveryClient = new DeliveryClient({
  projectId = '<YOUR_PROJECT_ID>';
  previewApiKey: '<YOUR_PREVIEW_API_KEY>',
  globalQueryConfig: {
    // Ensures that Preview API is used
    usePreviewMode: true
  }
});
```

#### Enable preview mode per query

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .queryConfig({
    // Ensures that Preview API is used
    usePreviewMode: true
  })
  .toPromise()
  .subscribe(response => console.log(response));
```

### Secured Delivery API mode

**Important**: Using the Delivery API with [secure access](https://docs.kontent.ai/tutorials/develop-apps/build-strong-foundation/restrict-public-access) enabled is recommend only when the query is not run on a client because otherwise you will expose the API key publicly. For example, using secured delivery API in a Node.js app is ok, but using it in a web application is not because anyone could see the key.

```typescript
import { DeliveryClient } from '@kentico/kontent-delivery';

const deliveryClient = new DeliveryClient({
  projectId = '<YOUR_PROJECT_ID>';
  secureApiKey: '<YOUR_SECURE_ACCESS_KEY>',
    globalQueryConfig: {
      // Enabled secure access for all queries
      useSecuredMode: true
  }
});
```

As with [preview mode](#preview-mode), you can also override global settings on query level.

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .queryConfig({
    // Enables secure access only for this query
    useSecuredMode: true
  })
  .toPromise()
  .subscribe(response => console.log(response));
```

### Image transformation

The `ImageUrlBuilder` exposes methods for applying [image transformations](https://docs.kontent.ai/reference/image-transformation) on asset URLs.

```typescript
import { ImageUrlBuilder, ImageCompressionEnum } from '@kentico/kontent-delivery';

// Sample asset URL; You'll find URLs like these in asset and rich text elements
const assetUrl = `https://assets.kenticocloud.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/22504ba8-2075-48fa-9d4f-8fce3de1754a/warrior.jpg`

const imageUrlBuilder = new ImageUrlBuilder(assetUrl)
  .withDpr(2)
  .withCompression(ImageCompressionEnum.Lossless)
  .withQuality(4)
  .withHeight(200)
  .withWidth(100);

// Gets URL to image with query parameters
const transformedUrl = imageUrlBuilder.getUrl();
```

### URL Slugs (links)

#### Resolve URL slugs globally

The URL slugs (links) can be resolved in `URLSlugElement` or `RichTextElement` elements. The way how links are resolved depends on the `urlSlugResolver` which can be defined either globally in model class, or by using the `queryConfig` method of an API call. The query resolver has priority over the globally defined one.

To access the resolved URL, call the `resolveUrl` method.

When resolving links in `RichTextElement`, you resolve all of them with a single link resolver. For this reason, it is recommended that you specify the `type` of the content type you want to resolve. Also, if a link is inside RichTextElement, you may access the original link text using the `context` parameter.

```typescript
import { ContentItem, Elements } from '@kentico/kontent-delivery';

export class Actor extends ContentItem {
  public title: Elements.TextElement;
  public slug: Elements.UrlSlugElement;

    constructor() {
    super({
      urlSlugResolver: (link, context) => {
        return { url: `/actors/${url_slug}` };
      }
    })
  }
}

// get url
deliveryClient.item<Actor>('tom_hardy')
  .toPromise()
  .subscribe(response => console.log(response.item.slug.resolveUrl()));
```

#### Resolve URL slugs on query level

```typescript
import { ContentItem, Elements } from '@kentico/kontent-delivery';

deliveryClient.item<Actor>('tom_hardy')
  .queryConfig({
    urlSlugResolver: (link, context) => {
        if (link.type === 'actor'){
          return { url: `/actors/${urlSlug}`};
        }
        else if (link.type === 'movie'){
          return { url: `/movies/${urlSlug}`};
        }
        return { url: 'unsupported-link'};
      }
  })
  .toPromise()
  .subscribe(response => console.log(response.item.slug.resolveUrl()));
```

#### Resolve URL slugs as HTML

In some cases you might want to customize link tag (`<a>`) to add CSS classes, attributes or otherwise customize the HTML. You can achieve this by setting `html` property of `IUrlSlugResolverResult` interface. See example:

```typescript
import { ContentItem, Elements } from '@kentico/kontent-delivery';

deliveryClient.item<Actor>('tom_hardy')
  .queryConfig({
    urlSlugResolver: (link, context) => {
        if (link.type === 'actor'){
          return {
            html: '<div>ActorLink</div>'
          }
        }
        return undefined;
      }
  })
  .toPromise()
  .subscribe(response => console.log(response.item.slug.resolveUrl()));
```

### Resolve content items and components in Rich text elements

[Rich text elements](https://developer.kenticocloud.com/v1/reference#section-rich-text-element) in Kentico Kontent can contain other content items and [components](https://help.kenticocloud.com/composing-and-linking-content/components/structuring-editorial-articles-with-components). For example, if you write a blog post, you might want to insert a video or testimonial to a specific place in your article.

You need to define how these objects resolve to the HTML that will be rendered. This can be done globally for each content type using the `richTextResolver` option, or per query. The following example shows how to resolve the `Actor` content items or components used in all your rich text elements.

Note: Items and components are resolved using the same mechanism; your application does not need to differentiate them. You can learn more about the differences between items and components in our [API Reference](https://developer.kenticocloud.com/v1/reference#linked-content).

#### Globally

```typescript
import { ContentItem, Elements, RichTextContentType } from '@kentico/kontent-delivery';

class Actor extends ContentItem {
  public name: Elements.TextElement;

  constructor() {
    super({
        richTextResolver: (item: Actor, context) => {
          return `<h3 class="resolved-item">${item.name.value}</h3>`;
        }
      })
    }
}

class Movie extends ContentItem {
  public title: Elements.TextElement;
  public plot: Elements.RichTextElement;
}

deliveryClient.item<Movie>('pain_and_gain')
  .toPromise()
  .subscribe(response => {
    console.log(response.item.plot.resolveHtml());
    // Example output:
    // {html from your rich text element before the linked item}
    // <h3>Dwayne Johsnon</h3>
    // {html from your rich text element after the linked item}
  });
```

#### Locally per query

You can define a resolver for a particular query. Resolver defined this way has priority over the globally defined one.

```typescript
import { ContentItem } from '@kentico/kontent-delivery';

deliveryClient.item<Movie>('pain_and_gain')
    queryConfig({
      richTextResolver: (item: ContentItem, context) => {
        if (item.system.type == 'actor') {
          var actor = item as Actor;
          return `<h2>${actor.name.value}</h2>`;
        }
    })
  })
  .toPromise()
  .subscribe(response => {
    console.log(response.item.plot.resolveHtml());
    // Example output:
    // {html from your rich text element before the linked item}
    // <h3>Dwayne Johsnon</h3>
    // {html from your rich text element after the linked item}
  });
```

### Strongly typed nested items

If your item has linked items, they will be resolved using the `typeResolver` defined for that type. This is recursive and will be applied for all items in your response. If the content item is not present in model, try increasing `depth` of your request.

If you are using typescript, you would define elements such as:

```typescript
import { ContentItem, Elements} from '@kentico/kontent-delivery';

export class Actor extends ContentItem {
  public name: Elements.TextElement;
}

export class Movie extends ContentItem {
  public title: Elements.TextElement;
  public stars: Elements.LinkedItemsElement<Actor>[];
}
```

### Handle missing references to linked items

If one of your elements references linked items which are not present in the response due to low 'depth' parameter, you can choose to throw an Error by enabling `throwErrorForMissingLinkedItems` in your `queryConfig`.

Also, if you enable advanced logging, you will see a warning in console if such situation occurs. By default, the SDK doesn't enforce loading all items unless they are required for resolving (e.g. rich text resolver).

Following example shows how to enforce that all referenced linked items are present in the response:

```typescript
deliveryClient.item<Movie>('pain_and_gain')
    queryConfig({
      throwErrorForMissingLinkedItems: true
    })
  .toPromise()
  .subscribe(response => {
    console.log(response);
  });
```

### Custom resolving for content items

If, for any reason, you need to use custom resolving for specific item instead of the default one, consider using the `itemResolver` property in `queryConfig` of your query.

```typescript
import { ContentItem } from '@kentico/kontent-delivery';

class FakeActor extends ContentItem {
    constructor(
      public fakeName: string
    ) {
      super();
    }
}

deliveryClient.item<Movie>('pain_and_gain')
    queryConfig({
      itemResolver: (rawElement: ElementContracts.IElementContract, rawItem: ItemContracts.IContentItemContract, modularContent: ItemContracts.IModularContentContract, queryConfig: IItemQueryConfig) => {
        if (itemCodename === 'itemCodename') {
          return new FakeActor('xxx'),
        }
        // If you return 'undefined' default resolver will take place
        return undefined;
    })
  })
  .toPromise()
  .subscribe(response => {
    // 'actor' will be an instance of 'FakeActor' class
    const actor = response.item.stars[0];
  });
```

### Image processing inside Rich Text elements

Rich text elements may contain images and in some situation you might want to adjust the `src` attribute in order to optimize image delivery using for example [Image transformations](https://github.com/Kentico/kentico-kontent-js/blob/master/packages/delivery/DOCS.md#image-transformations) (compression, max height/width declaration etc.).

To modify source of image, use `richTextImageResolver` property of the `queryConfig`. The `richTextImageResolver` expects you to return an object with `url` property. See example below:

```typescript
import { ImageUrlBuilder, ImageCompressionEnum, ImageFitModeEnum } from '@kentico/kontent-delivery';

deliveryClient.item<Movie>('warrior')
   .queryConfig({
        richTextImageResolver: (image, elementName) => {
          const newImageUrl = new ImageUrlBuilder(image.url)
            .withHeight(150)
            .withCompression(ImageCompressionEnum.Lossy)
            .withFitMode(ImageFitModeEnum.Crop)
            .getUrl();

          return {
            url: newImageUrl
          };
        },
      })
  .toPromise()
  .subscribe(response => {
    // work with response
  });

```

## Get content types

To retrieve information about your content types, you can use the `type` and `types` methods.

```typescript
deliveryClient
  .type('movie') // codename of the type
  .toPromise()
  .subscribe(response => console.log(response));

deliveryClient.types()
  .toPromise()
  .subscribe(response => console.log(response));
```

## Get taxonomies

To retrieve information about your taxonomies, you can use the `taxonomy` and `taxonomies` methods.

```typescript
deliveryClient  
  .taxonomy('taxonomyGroupName') // codename of the Taxonomy group
  .toPromise()
  .subscribe(response => console.log(response));
  });  

deliveryClient  
  .taxonomies()
  .toPromise()
  .subscribe(response => console.log(response));
  });
```

## Client configuration

Following is a list of configuration options for DeliveryClient (`IDeliveryClientConfig`):

| Property        | type| description|
| ------------- |:-------------:| -----:|
| projectId      | string | ProjectId of your Kentico Kontent project|
| typeResolvers?| TypeResolver[] | Array of resolvers that are used to create instances of registered classes automatically. If not set, items will be instances of 'ContentItem' class|
| elementResolver?| ElementResolver | Element resolver used to map custom elements to models |
| previewApiKey?| string| Preview API key used to get unpublished content items |
| defaultLanguage?| string| Sets default language that will be used for all queries unless overriden with query parameters|
| proxy?| IDeliveryClientProxyConfig | Can be used to configure custom URLs. Useful when you use reverse proxy or have a need to transform URL - e.g. to remove 'projectId' |
| secureApiKey?| string| Secured API key: Use secured API only when running on Node.JS server, otherwise you can expose your key|
| globalQueryConfig? | IQueryConfig | Default configuration for all queries. Can be overriden by indidividual queries
| retryAttempts?| number | Number of retry attempts when error occures. Defaults to '3'. Set to '0' to disable. |
| linkedItemResolver.linkedItemWrapperTag? | string | HTML tag used to wrap resolved linked items in Rich text elements (defaults to 'div') |
| linkedItemResolver.linkedItemWrapperClasses? | string[] | Array of classes added to linked item wrapper. Defaults to a single class 'kc-linked-item-wrapper' |
| httpService ?| IHttpService | Can be useud to inject custom http service for performing requests |
| globalHeaders? | (queryConfig: IQueryConfig) => IHeader[] | Adds ability to add extra headers to each http request |
| collissionResolver? | ItemElementElementResolver[] | Resolver called when there are multiple elements with the same name in content item (example collision element names include 'system' or 'elements'). By default an underscore is added before original element name. If the element name is still in collission, element is excluded from mapping. |
| retryStatusCodes? | number[] | Array of status codes that should be retried when request fails. Defaults to requests with '500' status code. |
| richTextParserAdapter? | IRichTextHtmlParser | Custom implementation of rich text parser. Default parser for browser / node.js is used if none is specified |

## Proxy configuration

If you want to use a proxy server, you need to use different domain or otherwise transform URL. By using `proxy` configuration option you can define your own base domains as well as URL format. This is useful if you need to for example hide the `projectId` from URL.

`IDeliveryClientProxyConfig` offers 3 ways of configuring proxy url:

1) `baseUrl` - Base url used for preview reqeusts. Defaults to 'preview-deliver.kontent.ai'
2) `basePreviewUrl` - Base url used for all requests. Defaults to 'deliver.kontent.ai'
3) `advancedProxyUrlResolver` - Resolver function where you get `IProxyUrlData` context data (includes domain, action, query parameters..) and can fully customize final URL.

Examples:

```typescript
const client = new DeliveryClient({
  projectId: 'xxx',
  // Will be used instead of 'https://deliver.kontent.ai' for all requests.
  // Parameters, filters, project Id and other parts of URL will use default values.
  proxy: {
    baseUrl: 'http://my-proxy.io'
  }
});
```

```typescript
const client = new DeliveryClient({
  projectId: 'xxx',
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

If the error originates in Kentico Kontent (see [error responses](https://developer.kenticocloud.com/v1/reference#error-responses)), you will get a `DeliveryError` object instance with more specific information. Otherwise, you will get original error.

```typescript
import { DeliveryError } from '@kentico/kontent-delivery';

deliveryClient.item<Movie>('terminator_9')
  .get()
  .subscribe(response => console.log(response), error => {
    if (error instanceof DeliveryError) {
      // delivery specific error (e.g. item with codename not found...)
      console.log(err.message, err.errorCode);
    }
    else {
      // original error
      console.log(error);
    }
  });
```

## Debugging

### Accessing request data

Every response from this SDK contains `debug` property which can be used to inspect raw response.

```typescript
deliveryClient.items<ContentItem>()
  .get()
  .subscribe(response => {
    console.log(response.debug);
  });
```

### Getting URL of a query

In case you need to get the raw URL of a request before calling it, use the `getUrl()` method on any query.

```typescript
const queryText = deliveryClient.items<ContentItem>()
  .type('movie')
  .limitParameter(10)
  .orderParameter('system.codename', SortOrder.desc)
  .getUrl();

console.log(queryText);
// outputs:
// https://deliver.kontent.ai/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items?limit=10&order=system.codename[desc]&system.type=movie
```

### Using custom HTTP service

The SDK allows you to inject your own instance of a class implementing the `IHttpService` interface. This way you can easily mock responses, implement your own http service, or modify the requests in some other way.

Here's a sample `IHttpService` class:

```typescript
import {
    IResponse,
    IHttpDeleteQueryCall,
    IHttpGetQueryCall,
    IHttpPatchQueryCall,
    IHttpPostQueryCall,
    IHttpPutQueryCall,
    IHttpQueryOptions,
    IHttpService,
} from '@kentico/kontent-core';

import { DeliveryClient } from '../../../lib';

class CustomHttpService implements IHttpService {
    retryPromise<T>(
        promise: Promise<T>,
        options: { maxRetryAttempts: number; useRetryForResponseCodes: number[]; delay: number }
    ): Promise<T> {
        throw new Error('Method not implemented.');
    }

    get<TError extends any, TRawData extends any>(
        call: IHttpGetQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Promise<IResponse<TRawData>> {
        return of(<IResponse<TRawData>>{
            data: {} as any,
            response: undefined,
            headers: [],
            status: 200
        });
    }

    post<TError extends any, TRawData extends any>(
        call: IHttpPostQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Promise<IResponse<TRawData>> {
        return of(<IResponse<TRawData>>{
            data: {},
            response: undefined
        });
    }

    put<TError extends any, TRawData extends any>(
        call: IHttpPutQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Promise<IResponse<TRawData>> {
        return of(<IResponse<TRawData>>{
            data: {} as any,
            response: undefined,
            headers: [],
            status: 200
        });
    }

    patch<TError extends any, TRawData extends any>(
        call: IHttpPatchQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Promise<IResponse<TRawData>> {
        return of(<IResponse<TRawData>>{
            data: {} as any,
            response: undefined,
            headers: [],
            status: 200
        });
    }

    delete<TError extends any, TRawData extends any>(
        call: IHttpDeleteQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Promise<IResponse<TRawData>> {
        return of(<IResponse<TRawData>>{
            data: {} as any,
            response: undefined,
            headers: [],
            status: 200
        });
    }
}
```

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.

