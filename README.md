# Kentico Cloud Delivery JavaScript / TypeScript SDK

[![npm version](https://badge.fury.io/js/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)
[![Build Status](https://api.travis-ci.org/Enngage/KenticoCloudDeliveryTypeScriptSDK.svg?branch=master)](https://travis-ci.org/Enngage/KenticoCloudDeliveryTypeScriptSDK)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-delivery-typescript-sdk.svg)](https://www.npmjs.com/package/kentico-cloud-delivery-typescript-sdk)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)
[![Coverage Status](https://coveralls.io/repos/github/Enngage/KenticoCloudDeliveryTypeScriptSDK/badge.svg?branch=master)](https://coveralls.io/github/Enngage/KenticoCloudDeliveryTypeScriptSDK?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/enngage/kenticoclouddeliverytypescriptsdk/badge.svg)](https://snyk.io/test/github/enngage/kenticoclouddeliverytypescriptsdk)
[![Dependency Status](https://dependencyci.com/github/Enngage/KenticoCloudDeliveryTypeScriptSDK/badge)](https://dependencyci.com/github/Enngage/KenticoCloudDeliveryTypeScriptSDK)

A client library for retrieving content from [Kentico Cloud](https://kenticocloud.com/) that supports JavaScript and TypeScript.

<table>
<tbody>
<tr>
<th><h3>JavaScript</h3></th><th><h3>TypeScript</h3></th>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK/tree/master/javascript">Documentation</a></td><td><a href="#getting-started">Documentation</a></td>
</tr>
<tr>
<th colspan="2">Sample apps</th>
</tr>
<tr>
<td><a href="https://github.com/Enngage/KenticoCloudSampleJavascriptApp">Vanilla JavaScript app</a></td><td><a href="https://github.com/Enngage/KenticoCloudSampleAngularApp">Angular app</a></td>
</tr>
</tbody>
</table>

## Getting started

```
npm i kentico-cloud-delivery-typescript-sdk --save
```


### Create model

```typescript
import { ContentItem, Fields } from 'kentico-cloud-delivery-typescript-sdk';

export class Movie extends ContentItem {
  public title: Fields.TextField;
}
```

You can use [Kentico Cloud Model Generator Utility](https://www.npmjs.com/package/kentico-cloud-model-generator-utility)  NPM package to help you generate TypeScript models from your [Kentico Cloud](https://kenticocloud.com/) project. Read more about models and their features further in this documentation.

### Initialize DeliveryClient

<table>
<tbody>
<tr>
<th>TypeScript</th>
</tr>
<tr>
<td>

```typescript
// kentico cloud
import { DeliveryClient, DeliveryClientConfig, TypeResolver } from 'kentico-cloud-delivery-typescript-sdk';

// models
import { Movie } from './movie'; // use your own path to movie class model

let projectId = 'projectId';

let typeResolvers: TypeResolver[] = [
    new TypeResolver("movie", () => new Movie()),
  ];

var deliveryClient = new DeliveryClient(
  new DeliveryClientConfig(projectId, typeResolvers)
  )
```

</td>
</tr>
<tr>
<th>JavaScript</th>
</tr>
<tr>
<td>

```javascript
here will be a JavaScript example
```

</td>
</tr>
</tbody>
</table>

### Use it

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .get()
  .subscribe(response => console.log(response));
```

## API Documentation

### Getting data (Observable)

To get multiple content items, use the `items` method. You can specify content type with the `type` method:

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .get()
  .subscribe(response => console.log(response));
```

To get a single content item, use the `item` method:

```typescript
deliveryClient.item<Movie>('movieCodename')
  .get()
  .subscribe(response => console.log(response));
```

### Getting data (Promise)

Get methods return rxjs [Observable](http://reactivex.io/rxjs/manual/overview.html#introduction) which is more powerful than a Promise (they are easily cancellable, repeatable...), but you might want to use `Promises` instead depending on your scenario & application. Luckily, converting an `Observable` to a `Promise` is very easy with [toPromise()](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-toPromise) method.

```typescript
deliveryClient.item<Movie>('movieCodename')
  .get()
  .toPromise()
    .then(response => console.log(response))
    .catch(err => console.log('error:' + err));
```

### Using query parameters

You can combine query parameters. For more information about parameters, see the [Kentico Cloud API reference](https://developer.kenticocloud.com/v1/reference#listing-responses).

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .limitParameter(5)
  .skipParameter(2)
  .get()
  .subscribe(response => console.log(response));
```

Supported query parameters: `depthParameter`, `elementsParameter`, `limitParameter`, `orderParameter`, `skipParameter` and `languageParameter`.

### Filtering

This example returns all **Movie** content items whose **title** element is equal to **Warrior**. Filters are also considered query parameters and can be combined. See [Content filtering](https://developer.kenticocloud.com/v1/reference#content-filtering) in the Kentico Cloud API reference for more general examples.

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .equalsFilter('elements.title', 'Warrior')
  .get()
  .subscribe(response => console.log(response));
```

Supported filters: `allFilter`, `anyFilter`, `containsFilter`, `equalsFilter`, `greaterThanFilter`, `greaterThanOrEqualFilter`, `infilter`, `lessThanFilter`, `lessThanOrEqualFilter`, `rangeFilter`.

### Sorting

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .orderParameter('elements.title', SortOrder.desc)
  .get()
  .subscribe(response => console.log(response));

deliveryClient.items<Movie>()
  .type('movie')
  .orderParameter('elements.title', SortOrder.asc)
  .get()
  .subscribe(response => console.log(response));
```

### Getting localized items

You can specify the [language of items](https://developer.kenticocloud.com/v1/docs/localization) with `languageParameter` of particular query. You can also specify default language that will be used if `languageParameter` is not used during the initialization of `DeliveryClientConfig`. 

```typescript
var deliveryClient = new DeliveryClient(
  new DeliveryClientConfig(projectId, typeResolvers,
  {
    defaultLanguage: 'es'
  })
)

// gets items in 'es' language
deliveryClient.item<Movie>('movieCodename')
  .get()
  .subscribe(response => console.log(response));

// gets items in 'en' language
deliveryClient.item<Movie>('movideCodename')
  .languageParameter(`en`)
  .get()
  .subscribe(response => console.log(response));
```

### Creating models

Each model class needs to extend the `ContentItem` class and each element needs to use one of the supported fields. For example, if you define a Text element in your content type, you need to use a `TextField` in your model:

```typescript
import { ContentItem, Fields} from 'kentico-cloud-delivery-typescript-sdk';

export class Movie extends ContentItem {
  public title: Fields.TextField;
  public plot: Fields.RichTextField;
  public released: Fields.DateTimeField;
  public length: Fields.NumberField;
  public poster: Fields.AssetsField;
  public category: Fields.MultipleChoiceField;
}
```

Supported fields: `TextField`, `MultipleChoiceField`, `DateTimeField`, `RichTextField`, `NumberField`, `AssetsField`, `UrlSlugField` and `TaxonomyField`

#### Don't want to waste time creating models manually? 

Try [Kentico Cloud model generator utility](https://www.npmjs.com/package/kentico-cloud-model-generator-utility) package that can generate `typescript` models out of your Kentico Cloud project automatically.

### Nesting modular content 

To include modular content, simply reference a given type class:

```typescript
import { ContentItem, Fields} from 'kentico-cloud-delivery-typescript-sdk';

export class Actor extends ContentItem {
  public name: Fields.TextField;
}

export class Movie extends ContentItem {
  public title: Fields.TextField;
  public stars: Actor[];
}
```

### Property binding in models

Kentico Cloud returns all element names in **lowercase**. Because Javascript properties are case sensitive, the binding will fail if your property is called, for example, *firstName*. You can either use **codeName() decorator** that comes with the SDK, **lowercase only properties** or use a custom resolver to bind fields to their proper names:

```typescript
import { ContentItem, Fields, FieldsDecorator } from 'kentico-cloud-delivery-typescript-sdk';

export class Actor extends ContentItem {
  @FieldsDecorator.codeName('firstname')
  public firstName: Fields.TextField;
  public lastName: Fields.TextField;
  public bio: Fields.RichTextField;

    constructor() {
    super({
      propertyResolver: ((fieldName: string) => {
        if (fieldName === 'lastname') { // lowercase field returned by Kentico delivery API
          return 'lastName'; // name of 'Actor.firstName' property
        }
        return fieldName;
      })
    });
  }
}
```

### Preview mode

You can enable the preview mode either globally (when initializing the DeliveryClient) or per query. For example, you might disable preview mode globally, but enable it for one particular query for testing purposes. In each case you need to set `previewApiKey` in the DeliveryClientConfig.

#### Enabling preview mode globally

```typescript

let previewApiKey = 'previewApiKey';
let projectId = 'projectId';
let typeResolvers: TypeResolver[] = [
    new TypeResolver("movie", () => new Movie()),
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
deliveryClient.items<Movie>()
  .type('movie')
  .queryConfig({
    usePreviewMode: true
  })
  .get()
  .subscribe(response => console.log(response));
```

### URL Slugs (links)

Url slugs (links) can be resolved in either `URLSlugField` or `RichTextField` fields. The way how links are resolved depends on the `linkResolver` which can be defined either globally in model definition, or passed it through the `IQueryConfig` of a particular api call. The query resolver has priority over the globally defined one. 

To access the url call `getUrl` method.

Please note that when resolving links in RichTextField, you resolve all of them with a single link resolver. For this reason it is recommended that you specify the `type` of the content type you want to resolve.

#### Resolving URL slugs (links) globally

```typescript
import { ContentItem, Fields, ILink } from 'kentico-cloud-delivery-typescript-sdk';

export class Actor extends ContentItem {
  public title: Fields.TextField;
  public slug: Fields.UrlSlugField;

    constructor() {
    super({
      linkResolver: (link: ILink) => {
        if (link.type === 'actor'){
          return `/actors/${urlSlug}`;
        }
        return 'unkown-type-link';
      }
    })
  }
}
```

```typescript
deliveryClient.item<Actor>('actorCodename')
  .get()
  .subscribe(response => console.log(response.item.slug.getUrl()));
```

#### Resolving URL slugs (links) per query

```typescript
import { ContentItem, Fields, ILink } from 'kentico-cloud-delivery-typescript-sdk';

deliveryClient.item<Actor>('actorCodename')
  .queryConfig({
    linkResolver: (link: ILink) => {
        if (link.type === 'actor'){
          return `/actors/${urlSlug}`;
        }
        else if (link.type === 'movie'){
          return `/movies/${urlSlug}`;
        }
        return 'unkown-type-link';
      }
  })
  .get()
  .subscribe(response => console.log(response.item.slug.getUrl()));
```

### Resolving modular content in Rich text fields

If you have a modular content item inside a Rich text element, you need to define how each content type resolves to the HTML that will be rendered. This can be done globally for each type using the `richTextResolver` option, or per query. The following example shows how to resolve the `Actor` modular items used in all your rich text fields.

#### Globally

```typescript
import { ContentItem, Fields } from 'kentico-cloud-delivery-typescript-sdk';

export class Actor extends ContentItem {
  public name: Fields.TextField;

  constructor() {
    super({
        richTextResolver: (item: Actor) => {
          return `<h3>${item.name.text}</h3>`;
        }
      })
    }
}

export class Movie extends ContentItem {
  public title: Fields.TextField;
  public plot: Fields.RichTextField;
}
```

Result:

```typescript
deliveryClient.item<Movie>('pain_and_gain')
  .get()
  .subscribe(response => {
    console.log(response.item.plot.getHtml());
    // Example output:
    // {html from your the plot before modular items}
    // <h3>Dwayne Johsnon</h3>
    // {html from your the plot after the modular items}
  });
```

#### Locally per query

You can specifically define a resolver for a particular query. Resolver defined this way has priority over the globally defined one.

```typescript
deliveryClient.item<Movie>('pain_and_gain')
    queryConfig({
      richTextResolver: (item: Actor) => {
        if (item.system.type == 'actor') {
          var actor = item as Actor;
          return `<h2>${actor.name.text}</h2>`;
        }
    })
  })
  .subscribe(response => {
    console.log(response.item.plot.getHtml());
    // Example output:
    // {html from your the plot before modular items}
    // <h3>Dwayne Johsnon</h3>
    // {html from your the plot after the modular items}
  });
```

## Working with content types

To retrieve information about your content types, you can use the methods `type` and `types`.

### Getting a single content type

```typescript
deliveryClient
  .type('movie') // codename of the type
  .get()
  .subscribe(response => console.log(response));
```

### Getting multiple content types

```typescript
deliveryClient.types()
  .get()
  .subscribe(response => console.log(response));
```

## Working with taxonomies

To retrieve taxonomies or taxonomy you can use `taxonomy` and `taxonomies` methods.

### Getting a single taxonomy group

```typescript
deliveryClient  
  .taxonomy('movieType') // codename of the Taxonomy group
  .get()
  .subscribe(response => console.log(response));
  });  
```

### Getting multiple taxonomies

```typescript
deliveryClient  
  .taxonomies()
  .get()
  .subscribe(response => console.log(response));
  }); 
```

## Handling errors

Error can be handled using the `error` parameter of the `subscribe` method (see [RxJS documentation](https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/error_handling.html)) or the `catch` method. If the error originated with Kentico Cloud (see [error responses](https://developer.kenticocloud.com/v1/reference#error-responses)), you will get a `CloudError` model with more specific information. Otherwise, you will get an original exception.

```typescript
import { CloudError } from 'kentico-cloud-delivery-typescript-sdk';

deliveryClient.item<Movie>('terminator_9')
  .get()
  .subscribe(response => console.log(response), err => {
    // handle Cloud specific errors
    if (err instanceof CloudError) {
      // outputs 'The requested content item 'terminator_9' was not found.'
      console.log(err.message); 
    }
    else {
      // handle generic errors
      console.log(err);
    }
  });

deliveryClient.item<Movie>('terminator_9')
  .get()
  .catch(err => {
      // handle Cloud specific errors
      if (err instanceof CloudError) {
        // outputs 'The requested content item 'terminator_9' was not found.'
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

## Debugging

### Accessing request data

Every response from this SDK contains `debug` property which can be used to view the raw request using the `CloudResponseDebug` model that is based on `AjaxResponse` from rxjs.

```typescript
deliveryClient.items()
  .get()
  .subscribe(response => {
    console.log(response.debug); // complete 'CloudResponseDebug' object
    console.log(response.debug.status); // e.g. '200'
    console.log(response.debug.responseType); // e.g. 'json'
    console.log(response.debug.request.url); // url of the request
    // and many others..
  });
 ``` 

### Getting URL of a query

In case you need to get the raw URL of a request before calling it, use the `toString()` method on the `item` query.

```typescript
var queryText = deliveryClient.items()
  .type('movie')
  .limitParameter(10)
  .orderParameter('system.codename', SortOrder.desc)
  .toString();

console.log(queryText);
// outputs:
// https://deliver.kenticocloud.com/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items?limit=10&order=system.codename[desc]&system.type=movie
```

## Scripts

- Use `npm test` to run all tests.
- Use `npm run dev-test` to run developer tests created in `dev-test` folder. Use this for your testing purposes.
- Use `npm run nodejs-test` runs Node.js application and checks if response was successful
- Use `npm run build` to generate definitions & dist from the contents of `lib` folder.
- Use `npm run coveralls` to push coverage data directly to [https://coveralls.io](https://coveralls.io). Can be executed only after running`npm test`.

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.
