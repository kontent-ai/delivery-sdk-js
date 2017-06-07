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

## API Documentation

### Getting data

To get multiple items use `getItems` method with `codename` of your content type as parameter:

```typescript
deliveryClient.getItems<Character>("character").subscribe(response => console.log(response));
```

To get single item use `getItem` method:

```typescript
deliveryClient.getItem<Character>("character", "itemCodename").subscribe(response => console.log(response));
```

To get all items of all types use `getItems` with `ContentItem` type parameter:

```typescript
deliveryClient.getItems<ContentItem>().subscribe(response => console.log(response));
```

### Using query parameters

Query parameters can be combined. More info about parameters in [Kentico Cloud API reference](https://developer.kenticocloud.com/v1/reference#listing-responses) 

Don't forget to import all parameters before using them:

```typescript
import { LimitParameter, EqualsFilter, OrderParameter, SortOrder } from 'kentico-cloud-delivery-typescript-sdk';
```

```typescript
deliveryClient.getItems<Character>("character",
  [
    new LimitParameter(5),
    new OrderParameter("elements.name", SortOrder.desc)
    new SkipParameter(3)
  ])
  .subscribe(response => console.log(response));
```

Supported query parameters: `DepthParameter`, `ElementsParameter`, `LimitParameter`, `OrderByParameter`, `SkipParameter`

### Filtering

This example returns all **character** items whose **name** element is equal to **Rimmer**. Filters are also considered as `Query parameters` and can be combined. More info in [Kentico Cloud API reference](https://developer.kenticocloud.com/v1/reference#content-filtering)

```typescript
deliveryClient.getItems<Character>("character",
  [
     new EqualsFilter("elements.name", "Rimmer")
  ])
  .subscribe(response => console.log(response));
```

### Sorting

```typescript
deliveryClient.getItems<Character>("character",
  [
    new OrderParameter("elements.name", SortOrder.desc)
  ]
  ).subscribe(response => console.log(response));

deliveryClient.getItems<Character>("character",
  [
    new OrderParameter("elements.name", SortOrder.asc)
  ]
  ).subscribe(response => console.log(response));
```

Supported filters: `AllFilter`, `AnyFilter`, `ContainsFilter`, `EqualsFilter`, `GreaterThanFilter`, `GreaterThanOrEqualFilter`, `Infilter`, `LessThanFilter`, `LessThanOrEqualFilter`, `RangeFilter`

### Creating models

Each model class need to extend `ContentItem` and each element needs to use one of supported fields. For example if you define a 'text' field in your content type, you need to use `TextField` in your model:

```typescript
import { ContentItem TextField, NumberField, AssetsField, RichTextField, DateTimeField } from 'kentico-cloud-delivery-typescript-sdk';

export class Character extends ContentItem {
  public name: TextField;
  public age: NumberField;
  public birthdate: DateTimeField;
  public description: RichTextField;

  constructor() {
    super()
  }
}
```

### Nesting modular content 

To include modular content simply reference proper class:


```typescript
import { ContentItem TextField, NumberField } from 'kentico-cloud-delivery-typescript-sdk';

export class Character extends ContentItem {
  public name: TextField;
  public age: NumbeField;

  constructor() {
    super()
  }
}

export class Movie extends ContentItem {
  public movie: TextField;
  public release: NumberField;
  public characters: Character[]

  constructor() {
    super()
  }
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

You can enable preview mode either `globally` (when initializing DeliveryClient) or `per query`. For example you disable preview mode globally, but you can enable it for one particular query for testing purposes. 

#### Enabling preview mode globally

```typescript

let previewApiKey = 'yourPreviewApiKey';
let projectId = 'yourProjectId';
let typeResolvers: TypeResolver[] = [
    new TypeResolver("character", () => new Character()),
  ];

var deliveryClient = new DeliveryClient(
  new DeliveryClientConfig(projectId, typeResolvers, 
        {
            enablePreviewMode: true,
            previewApiKey: previewApiKey
        })
    )
```

#### Enabling preview mode per query

```typescript
deliveryClient.getItem<Character>(this.type, 'Rimmer', null, {
      usePreviewMode: true
    }).subscribe(response => {
      console.log(response);
    });
```

### Resolving URL Slugs

URL slugs enable you to generate user friendly URLs while giving editors the capability to control the looks of it. As a developer you will need to take the URL slug defined by editors and convert it to path that your application knows and can render. 

For example, if you define URL slug for your item as `dwayne-johnson` and your application is able to handle requests such as `yourApp.com/actors/{actor}`you will need to configure `urlSlugResolver` of your `ContentItem` class how to resolve such item. This example would transfer to following code:

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
To get the url simply access the `url` property of your `UrlslugField`:

```typescript
deliveryClient.getItem<Character>(this.type, 'someCodename').subscribe(response => {
  console.log(response.item.slug.url);
  });
```

Additionally, you can specify URL slug resolver when getting items using the `config` property of `getItems` or `getItem` method. Setting the URL slug resolver this way has priority over the one defined in model.

```typescript
.deliveryClient.getItem<Character>(this.type, 'someCodename', null, {
      urlSlugResolver: (contentItem: IContentItem, urlSlug: string) => {
        return `/actors/${urlSlug}`;
      }
    }).subscribe(response => {
      console.log(response.item.slug.url);
    });
```
### Resolving modular content in Rich text fields

If you have a `modular content item` inside a `Rich text` field, you need to define how each type resolves the HTML that will be rendered. This can be done globally for each type using the `richTextResolver` option, or per query. 

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
.deliveryClient.getItem<Character>('character', 'rick').subscribe(response => {
      console.log(response.item.someRichText.getHtml());
      // outputs:
      // <h3>Rick<h3>
    });
```

#### Per query

```typescript
.deliveryClient.getItem<Character>('character', 'rick', null,
      {
        richTextResolver: (item: IContentItem) => {
          if (item.system.type == 'character') {
            var character = item as Character;
            return `<h2>${character.name.text}</h2>`;
          }
        }
      })
      .subscribe(response => {
        console.log(response.item.someRichText.getHtml());
        // outputs:
        // <h2>Rick</h2>
      });
```


## Working with content types

To retrieve information about your content types, use `getType` or `getTypes` method.

### Get single content type

```typescript
deliveryClient.getType("character").subscribe(response => console.log(response));
```

### Get multiple content types


```typescript
deliveryClient.getTypes().subscribe(response => console.log(response));
```

## Handling errors

Errors can be handled with `error` parameter of `subscribe` method (see [RxJS documentation](https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/error_handling.html)) or with `catch` method.

```typescript
.deliveryClient.getItem<Character>("character", "invalidiItem") // throws 404
  .subscribe(
    response => console.log(response),
    err => console.log(err) // handle error
  );

deliveryClient.getItem<Character>("character", "invalidiItem") // throws 404
  .catch(err => {
    console.log(err);
    throw err;
  })
  .subscribe(
    response => console.log(response),
  );
```

## Todo's

- Tests

## Build (only for Git repo)

- Use `gulp build` to generate definitions & dist from the contents of `lib` folder
- Use `ng serve` to run sample angular2 app 




