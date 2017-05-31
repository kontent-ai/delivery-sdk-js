# Kentico Cloud SDK for Angular 2

Developer's SDK for [KenticoCloud](https://kenticocloud.com/)

## Getting started

```
npm install kentico-cloud-angular2-sdk --save
```

### Create model

```typescript
import { ContentItem, TextField } from 'kentico-cloud-angular2-sdk';

export class Character extends ContentItem {
  public name: TextField;

  constructor() {
    super()
  }
}
```

### Setup factory provider for DeliveryClient

```typescript
// core
import { Http } from '@angular/http';

// kentico cloud
import { DeliveryClient, DeliveryClientConfig, TypeResolver } from 'kentico-cloud-angular2-sdk';

// models
import { Character } from './character.class';

export function DeliveryClientFactory(http: Http) {

    let apiUrl = 'https://deliver.kenticocloud.com';
    let projectId = 'yourProjectId';

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("character", () => new Character()),
    ];

    return new DeliveryClient(
        http,
        new DeliveryClientConfig(apiUrl, projectId, typeResolvers)
    )
};

export var DeliveryClientProvider =
    {
        provide: DeliveryClient,
        useFactory: DeliveryClientFactory,
        deps: [Http]
    };

```

### Use factory provider in app.module

```typescript
import { DeliveryClientFactory } from 'your-delivery-factory-provider';

@NgModule({
  providers: [
    DeliveryClientFactory
  ],
  bootstrap: [AppComponent],
})
```

### Use in your component

```typescript
import { Component, OnInit } from '@angular/core';

// delivery client
import { DeliveryClient } from 'kentico-cloud-angular2-sdk';

// models
import { Character } from 'character.class';

@Component({
  templateUrl: 'sample.component.html',
})
export class SampleComponent implements OnInit {

  constructor(
    private deliveryClient: DeliveryClient
  ) {
  }

  ngOnInit(): void {
    this.deliveryClient.getItems<Character>("character").subscribe(response => console.log(response));
  }
}
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
import { ContentItem TextField, NumberField, AssetsField, RichTextField, DateTimeField } from 'kentico-cloud-angular-2-sdk';

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

### Nested modular content 

To include modular content simply reference proper class:


```typescript
import { ContentItem TextField, NumberField } from 'kentico-cloud-angular-2-sdk';

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

### Custom field binding in models

Kentico cloud returns all field names in **lowercase** and since javascript properties are case sensitive, the binding will fail if your property is called e.g. *firstName*. You can either use **lowercase only properties** or use custom resolver to bind fields to their proper names:

```typescript
import { ContentItem TextField, NumberField } from 'kentico-cloud-angular-2-sdk';

export class Person extends ContentItem {
  public firstName: TextField;
  public lastName: TextField;
  public age: NumbeField;

    constructor() {
    super({
      resolver: ((fieldName: string) => {
        if (fieldName === 'firstname') { // lowercase field returned by Kentico delivery API
          return 'firstName'; // name of 'Person' property
        }
        if (fieldName === 'lastname') {
          return 'lastName';
        }
      })
    }
}
```

### Handling errors

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

## Todo's

- Tests

## Build

- Use `gulp build` to generate definitions & dist from the contents of `lib` folder
- Use `ng serve` to run sample angular2 app

## Notes

- Only `Delivery API` is supported


