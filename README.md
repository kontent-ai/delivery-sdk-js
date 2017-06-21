# Kentico Cloud Delivery TypeScript SDK

Developer SDK for retrieving content from [Kentico Cloud](https://kenticocloud.com/).

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)

Sample applications using this SDK: [Javascript app](https://github.com/Enngage/KenticoCloudSampleJavascriptApp), [Angular app](https://github.com/Enngage/KenticoCloudSampleAngularApp)

## Getting started

```
npm i kentico-cloud-delivery-typescript-sdk --save
```

### Create model

```typescript
import { ContentItem, TextField } from 'kentico-cloud-delivery-typescript-sdk';

export class Character extends ContentItem {
  public name: TextField;
}
```

### Initialize DeliveryClient

```typescript
// kentico cloud
import { DeliveryClient, DeliveryClientConfig, TypeResolver } from 'kentico-cloud-delivery-typescript-sdk';

// models
import { Character } from './character.class';

let projectId = 'yourProjectId';

let typeResolvers: TypeResolver[] = [
    new TypeResolver("character", () => new Character()),
  ];

var deliveryClient = new DeliveryClient(
  new DeliveryClientConfig(projectId, typeResolvers)
  )

```

### Use it

```typescript
deliveryClient.items<Character>()
  .type('character')
  .get()
  .subscribe(response => console.log(response));
```

## API Documentation

### Getting data

To get multiple content items, use the `items` method. You can specify content type with the `type` method:

```typescript
deliveryClient.items<Character>()
      .type("character")
      .get()
      .subscribe(response => console.log(response));
```

To get a single content item, use the `item` method:

```typescript
deliveryClient.item<Character>('itemCodeName')
      .get()
      .subscribe(response => console.log(response));
```

### Using query parameters

You can combine query parameters. For more information about parameters, see the [Kentico Cloud API reference](https://developer.kenticocloud.com/v1/reference#listing-responses).

```typescript
deliveryClient.items<Character>()
  .type('character')
  .limitParameter(5)
  .skipParameter(2)
  .get()
  .subscribe(response => console.log(response));
```

Supported query parameters: `depthParameter`, `elementsParameter`, `limitParameter`, `orderParameter`, `skipParameter`.

### Filtering

This example returns all **Character** content items whose **name** element is equal to **Rimmer**. Filters are also considered query parameters and can be combined. See [Content filtering](https://developer.kenticocloud.com/v1/reference#content-filtering) in the Kentico Cloud API reference for more general examples.

```typescript
deliveryClient.items<Character>()
  .type('character')
  .equalsFilter('elements.name', 'Rimmer')
  .get()
  .subscribe(response => console.log(response));
```

Supported filters: `allFilter`, `anyFilter`, `containsFilter`, `equalsFilter`, `greaterThanFilter`, `greaterThanOrEqualFilter`, `infilter`, `lessThanFilter`, `lessThanOrEqualFilter`, `rangeFilter`.

### Sorting

```typescript
deliveryClient.items<Character>()
  .type('character')
  .orderParameter('elements.name', SortOrder.desc)
  .get()
  .subscribe(response => console.log(response));

deliveryClient.items<Character>()
  .type('character')
  .orderParameter('elements.name', SortOrder.asc)
  .get()
  .subscribe(response => console.log(response));
```

### Creating models

Each model class needs to extend the `ContentItem` class and each element needs to use one of the supported fields. For example, if you define a Text element in your content type, you need to use a `TextField` in your model:

```typescript
import { ContentItem TextField, NumberField, AssetsField, RichTextField, DateTimeField } from 'kentico-cloud-delivery-typescript-sdk';

export class Character extends ContentItem {
  public name: TextField;
  public age: NumberField;
  public birthdate: DateTimeField;
  public description: RichTextField;
}
```

### Nesting modular content 

To include modular content, simply reference a given type class:

```typescript
import { ContentItem TextField, NumberField } from 'kentico-cloud-delivery-typescript-sdk';

export class Character extends ContentItem {
  public name: TextField;
  public age: NumbeField;
}

export class Movie extends ContentItem {
  public movie: TextField;
  public release: NumberField;
  public characters: Character[]
}
```

### Field binding in models

Kentico Cloud returns all element names in **lowercase**. Because Javascript properties are case sensitive, the binding will fail if your property is called, for example, *firstName*. You can either use **lowercase only properties** or use a custom resolver to bind fields to their proper names:

```typescript
import { ContentItem TextField, NumberField } from 'kentico-cloud-delivery-typescript-sdk';

export class Person extends ContentItem {
  public firstName: TextField;
  public lastName: TextField;
  public age: NumbeField;

    constructor() {
    super({
      resolver: ((fieldName: string) => {
        if (fieldName === 'firstname') { // lowercase field returned by Kentico delivery API
          return 'firstName'; // name of 'Person.lastName' property
        }
        if (fieldName === 'lastname') {
          return 'lastName';
        }
      })
    }
}
```

### Preview mode

You can enable the preview mode either globally (when initializing the DeliveryClient) or per query. For example, you might disable preview mode globally, but enable it for one particular query for testing purposes. In each case you need to set `previewApiKey` in the DeliveryClientConfig.

#### Enabling preview mode globally

```typescript

let previewApiKey = 'yourPreviewApiKey';
let projectId = 'yourProjectId';
let typeResolvers: TypeResolver[] = [
    new TypeResolver("character", () => new Character()),
  ];

let deliveryClient = new DeliveryClient(
  new DeliveryClientConfig(projectId, typeResolvers, 
        {
            enablePreviewMode: true,
            previewApiKey: previewApiKey
        })
    )
```

#### Enabling preview mode per query

```typescript
deliveryClient.items<Character>()
  .type('character')
  .queryConfig({
    usePreviewMode: true
  })
  .get()
  .subscribe(response => console.log(response));
```

### URL Slugs

URL slugs enable you to generate user friendly URLs while giving editors the capability to control the looks of it. As a developer you will need to take the URL slug defined by editors and convert it to a path that your application knows and can render. URL slugs can be resolved either globally or locally for each query.

For example, if you define a URL slug for your item as `dwayne-johnson` and your application is able to handle requests such as `yourApp.com/actors/{actor}`, you will need to configure the `urlSlugResolver` of your `ContentItem` class to resolve such item. This example would transfer to the code below.

#### Resolving URL slugs globally

```typescript
import { ContentItem TextField, NumberField, UrlSlugField } from 'kentico-cloud-delivery-typescript-sdk';

export class Character extends ContentItem {
  public name: TextField;
  public age: NumbeField;
  public slug: UrlSlugField;

    constructor() {
    super({
      urlSlugResolver: (contentItem: IContentItem, urlSlug: string) => {
        // you can also access additional content data using the `contentItem` property
        return `/actors/${urlSlug}`;
      }
    })
  }
}
```

To get the URL, access the `url` property of your `UrlslugField`:

```typescript
deliveryClient.item<Character>('someCodename')
  .get()
  .subscribe(response => console.log(response.item.slug.url));
```

#### Resolving URL slugs locally

Additionally, you can specify a URL slug resolver when getting content items using the `queryConfig` method. Setting the URL slug resolver this way has priority over the one defined in a model.

```typescript
deliveryClient.item<Character>('someCodename')
  .queryConfig({
    urlSlugResolver: (contentItem: IContentItem, urlSlug: string) => {
      return `/actors/${urlSlug}`;
    }
  })
  .get()
  .subscribe(response => console.log(response.item.slug.url));
```

### Resolving modular content in Rich text fields

If you have a modular content item inside a Rich text element, you need to define how each content type resolves to the HTML that will be rendered. This can be done globally for each type using the `richTextResolver` option, or per query. The following example shows how to resolve the `Character` modular items used in your Rich text elements.

#### Globally

```typescript
import { ContentItem TextField, NumberField, AssetsField, RichTextField, DateTimeField } from 'kentico-cloud-delivery-typescript-sdk';

export class Character extends ContentItem {
  public name: TextField;
  public age: NumberField;
  public birthdate: DateTimeField;
  public description: RichTextField;

  constructor() {
    super({
        richTextResolver: (item: Character) => {
          return `<h3>${item.name.text}</h3>`;
        }
      })
    }
}
```

Result:

```typescript
deliveryClient.item<Character>('rick')
  .get()
  .subscribe(response => {
    console.log(response.item.someRichText.getHtml());
    // outputs:
    // {html from your Rich text field}
    // <h3>Rick</h3>
    // {html from your Rich text field}
  });
```

#### Locally per query

```typescript
.deliveryClient.item<Character>('rick')
    queryConfig({
      richTextResolver: (item: IContentItem) => {
        if (item.system.type == 'character') {
          var character = item as Character;
          return `<h2>${character.name.text}</h2>`;
        }
    })
  })
  .subscribe(response => {
  console.log(response.item.someRichText.getHtml());
  // outputs:
  // {html from your Rich text field}
  // <h2>Rick</h2>
  // {html from your Rich text field}
  });
```

## Working with content types

To retrieve information about your content types, you can use the methods `type` and `types`.

### Getting a single content type

```typescript
deliveryClient.type('character')
  .get()
  .subscribe(response => console.log(response));
```

### Getting multiple content types

```typescript
deliveryClient.types()
  .get()
  .subscribe(response => console.log(response));
```

## Handling errors

Error can be handled using the `error` parameter of the `subscribe` method (see [RxJS documentation](https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/error_handling.html)) or the `catch` method. If the error originated with Kentico Cloud (see [error responses](https://developer.kenticocloud.com/v1/reference#error-responses)), you will get a `CloudError` model with more specific information. Otherwise, you will get an original exception.

```typescript
import { CloudError } from 'kentico-cloud-delivery-typescript-sdk';

deliveryClient.item<Character>('rick2')
  .get()
  .subscribe(response => console.log(response), err => {
    // handle Cloud specific errors
    if (err instanceof CloudError) {
      // outputs 'The requested content item 'rick2' was not found.'
      console.log(err.message); 
      }
    else {
      // handle generic errors
        console.log(err);
      }
  });

deliveryClient.item<Character>('rick2')
  .get()
  .catch(err => {
      // handle Cloud specific errors
      if (err instanceof CloudError) {
        // outputs 'The requested content item 'rick2' was not found.'
        console.log(err.message);
      }
      else {
        // handle generic errors
        console.log(err);
      }
    return err;
  })
  .subscribe(response => console.log(response))
```

## Getting URL of a query

In case you need to get the raw URL of a request, call the `toString()` method on the `item` query.

```typescript
var queryText = deliveryClient.items()
  .type('character')
  .limitParameter(10)
  .orderParameter('system.codename', SortOrder.desc)
  .toString();

console.log(queryText);
// outputs:
// https://deliver.kenticocloud.com/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items?limit=10&order=system.codename[desc]&system.type=character
```

## Tests

- Run `ng test` to run tests

## Build (only for Git repo)

- Run `gulp build` to generate definitions & dist from the contents of `lib` folder
- Run `ng serve` to run testing angular2 app
