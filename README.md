# Kentico Cloud Delivery TypeScript SDK

Developer's SDK for [KenticoCloud](https://kenticocloud.com/)

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)

## Getting started

```
npm i kentico-cloud-delivery-typescript-sdk --save
```

### Create model

```typescript
import { ContentItem, TextField } from 'kentico-cloud-delivery-typescript-sdk';

export class Character extends ContentItem {
  public name: TextField;

  constructor() {
    super()
  }
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

To get multiple items use `items` method. Type can be specified with `type` method:

```typescript
deliveryClient.items<Character>()
      .type("character")
      .get()
      .subscribe(response => console.log(response));
```

To get single item use `item` method:

```typescript
deliveryClient.item<Character>('itemCodeName')
      .get()
      .subscribe(response => console.log(response));
```

### Using query parameters

Query parameters can be combined. More info about parameters in [Kentico Cloud API reference](https://developer.kenticocloud.com/v1/reference#listing-responses) 

```typescript
deliveryClient.items<Character>()
  .type('character')
  .limitParameter(5)
  .skipParameter(2)
  .get()
  .subscribe(response => console.log(response));
```

Supported query parameters: `depthParameter`, `elementsParameter`, `limitParameter`, `orderParameter`, `skipParameter`

### Filtering

This example returns all **character** items whose **name** element is equal to **Rimmer**. Filters are also considered as `Query parameters` and can be combined. More info in [Kentico Cloud API reference](https://developer.kenticocloud.com/v1/reference#content-filtering)

```typescript
deliveryClient.items<Character>()
  .type('character')
  .equalsFilter('elements.name', 'Rimmer')
  .get()
  .subscribe(response => console.log(response));
```

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

Supported filters: `allFilter`, `anyFilter`, `containsFilter`, `equalsFilter`, `greaterThanFilter`, `greaterThanOrEqualFilter`, `infilter`, `lessThanFilter`, `lessThanOrEqualFilter`, `rangeFilter`

### Creating models

Each model class need to extend `ContentItem` and each element needs to use one of supported fields. For example if you define a 'text' field in your content type, you need to use `TextField` in your model:

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

To include modular content simply reference given type class:

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

Kentico cloud returns all field names in **lowercase** and since javascript properties are case sensitive, the binding will fail if your property is called e.g. *firstName*. You can either use **lowercase only properties** or use custom resolver to bind fields to their proper names:

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

You can enable preview mode either `globally` (when initializing DeliveryClient) or `per query`. For example you disable preview mode globally, but you can enable it for one particular query for testing purposes. In each case you need to set `previewApiKey` of DeliveryClientConfig.

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

URL slugs enable you to generate user friendly URLs while giving editors the capability to control the looks of it. As a developer you will need to take the URL slug defined by editors and convert it to path that your application knows and can render. URL slug can be resolved either `globally` or locally for each `query`

For example, if you define URL slug for your item as `dwayne-johnson` and your application is able to handle requests such as `yourApp.com/actors/{actor}`you will need to configure `urlSlugResolver` of your `ContentItem` class how to resolve such item. This example would transfer to following code:

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
To get the url access the `url` property of your `UrlslugField`:

```typescript
deliveryClient.item<Character>('someCodename')
  .get()
  .subscribe(response => console.log(response.item.slug.url));
```

#### Resolving URL Slug locally

Additionally, you can specify URL slug resolver when getting items using the `queryConfig` method. Setting the URL slug resolver this way has priority over the one defined in model.

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

If you have a `modular content item` inside a `Rich text` field, you need to define how each type resolves the HTML that will be rendered. This can be done globally for each type using the `richTextResolver` option, or per query. Following example shows how to resolve `Character` modular items used in your rich text areas.

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

To retrieve information about your content types, use `type` or `types` method.

### Get single content type

```typescript
deliveryClient.type('character')
  .get()
  .subscribe(response => console.log(response));
```

### Get multiple content types

```typescript
deliveryClient.types()
  .get()
  .subscribe(response => console.log(response));
```

## Handling errors

Errors can be handled with `error` parameter of `subscribe` method (see [RxJS documentation](https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/error_handling.html)) or with `catch` method.

```typescript
.deliveryClient.item<Character>("character", "invalid_codename") // throws 404
  .get()
  .subscribe(
    response => console.log(response),
    err => console.log(err) // handle error
  );

deliveryClient.item<Character>('invalid_codename') // throws 404
  .get()
  .catch(err => {
    console.log(err);
    throw err;
  })
  .subscribe(
    response => console.log(response),
  );
```

## Getting URL of query

Call `toString()` method of the item query in case you need to get `raw` URL of request.

```typescript
var queryText = this.deliveryClient.items()
  .type('character')
  .limitParameter(10)
  .orderParameter('system.codename', SortOrder.desc)
  .toString();

console.log(queryText);
// outputs:
// https://deliver.kenticocloud.com/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items?limit=10&order=system.codename[desc]&system.type=character

## Tests

- Run `ng test` to run tests

## Build (only for Git repo)

- Run `gulp build` to generate definitions & dist from the contents of `lib` folder
- Run `ng serve` to run testing angular2 app




