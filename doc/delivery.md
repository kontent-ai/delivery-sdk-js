[![Analytics](https://ga-beacon.appspot.com/UA-69014260-4/Enngage/kentico-cloud-js/blob/master/doc/delivery.md)](https://github.com/igrigorik/ga-beacon)

## SDK Documentation

A client library for retrieving content from [Kentico Cloud](https://kenticocloud.com/) written in TypeScript and as UMD bundle, ES2015 and CommonJs formats.

## Installation

### npm

```
npm i rxjs --save
npm i kentico-cloud-delivery --save
```

### unpkg - browser only & minified

```
https://unpkg.com/kentico-cloud-delivery@latest/_bundles/kentico-cloud-delivery-sdk.browser.umd.min.js
```

### unpkg - node + browser & minified
```
https://unpkg.com/kentico-cloud-delivery@latest/_bundles/kentico-cloud-delivery-sdk.umd.min.js
```

### Quick start

```typescript
import { 
    ContentItem, 
    Fields,
    TypeResolver,
    DeliveryClient
    } from 'kentico-cloud-delivery';

/**
 * This is optional, but it is considered a best practice to define your models
 * so you can leverage intellisense and so that you can extend your models with 
 * additional properties / methods.
 */
export class Movie extends ContentItem {
  public title: Fields.TextField;
}

const deliveryClient = new DeliveryClient({
    projectId: 'xxx',
    typeResolvers: [
        new TypeResolver('movie', () => new Movie()),
    ]
});

/** Getting items from Kentico Cloud as Promise */
deliveryClient.items<Movie>()
    .type('movie')
    .getPromise()
    .then(response => {
        const movieText = response.items[0].title.text;
    )
});

/** Getting items from Kentico Cloud as Observable */
deliveryClient.items<Movie>()
    .type('movie')
    .getObservable()
    .subscribe(response => {
        const movieText = response.items[0].title.text;
    )
});

/**
 * Get data without having custom models 
 */
deliveryClient.items<ContentItem>()
  .type('movie')
  .getObservable()
  .subscribe(response => {
    // you can access properties same way as with strongly typed models, but note
    // that you don't get any intellisense and the underlying object 
    // instance is of 'ContentItem' type
    console.log(response.items[0].title.text);
});

```

## API Documentation

### Why Observable & RxJS?

We strongly recommend using `Observable` instead of `Promise` as observables support all that Promises too, and much more. Using `Observables` is especially important if you are building any modern application (i.e. SPA with React or Angular) as it allows you to easily cancel requests, merge and flatten request or retry them very easily.  

When creating a subscription, don't forget to unsubcribe when you don't need the result anymore (i.e. when navigating to different page)

### Getting data (Observable - recommended)

To get multiple content items, use the `items` method. You can specify the content type with the `type` method:

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .getObservable()
  .subscribe(response => console.log(response));

deliveryClient.item<Movie>('warrior')
  .getObservable()
  .subscribe(response => console.log(response));
```

### Getting data (Promise)

Get methods return rxjs [Observable](http://reactivex.io/rxjs/manual/overview.html#introduction) which is more powerful than a Promise (they are easily cancellable, repeatable...), but you might want to use `Promises` instead depending on your scenario & application. Luckily, converting an `Observable` to a `Promise` is very easy with [toPromise()](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-toPromise) method. Or you can use the built-in `getPromise` method that we introduced as a shortcut.

```typescript
deliveryClient.item<Movie>('warrior')
  .get()
  .toPromise()
    .then(response => console.log(response))
    .catch(err => console.log('error:' + err));

deliveryClient.item<Movie>('warrior')
  .getPromise()
    .then(response => console.log(response))
    .catch(err => console.log('error:' + err));
```

### Creating models

Every content type needs to have a corresponding class defined in both JavaScript & TypeScript. Each model class needs to extend the `ContentItem` class and each element needs to use one of the supported fields. For example, if you define a Text element in your content type, you need to use a `TextField` in your model:

```typescript
import { ContentItem, Fields} from 'kentico-cloud-delivery';

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

### Initializing DeliveryClient

```typescript
import { DeliveryClient, TypeResolver } from 'kentico-cloud-delivery';
import { Movie } from './movie'; // use your own path to movie class model

const deliveryClient = new DeliveryClient(
  projectId: 'xxx',
  typeResolver: [
    new TypeResolver('movie', () => new Movie())
  ]
)
```

### Use it

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .getObservable()
  .subscribe(response => console.log(response));
```

### Using query parameters

You can combine query parameters. For more information about parameters, see the [Kentico Cloud API reference](https://developer.kenticocloud.com/v1/reference#listing-response).

Supported query parameters: `depthParameter`, `elementsParameter`, `limitParameter`, `orderParameter`, `skipParameter` and `languageParameter`.

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .limitParameter(5)
  .skipParameter(2)
  .getObservable()
  .subscribe(response => console.log(response));
```

### Filtering

This example returns all **Movie** content items whose **title** element is equal to **Warrior**. Filters are also considered query parameters and can be combined. See [Content filtering](https://developer.kenticocloud.com/v1/reference#content-filtering) in the Kentico Cloud API reference for more general examples.

Supported filters:  `type`,  `types`, `allFilter`, `anyFilter`, `containsFilter`, `equalsFilter`, `greaterThanFilter`, `greaterThanOrEqualFilter`, `infilter`, `lessThanFilter`, `lessThanOrEqualFilter`, `rangeFilter`.

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .equalsFilter('elements.title', 'Warrior')
  .getObservable()
  .subscribe(response => console.log(response));
```

### Sorting

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .orderParameter('elements.title', SortOrder.desc)
  .getObservable()
  .subscribe(response => console.log(response));
```

### Executing with custom URL

When you have an URL (i.e. for `next page` in paging, for testing purposes or just if you prefer to build it on your own) and still want to leverage SDK functionality such as type mapping, property resolving etc., use `withUrl` parameter on any query such as:

```typescript
deliveryClient.items<Movie>()
  .withUrl('https://deliver.kenticocloud.com/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items?system.type=movie')
  .getObservable()
  .subscribe(response => console.log(response));
```

### Custom Parameters

In case you need to use custom parameters to build up an URL, use `customParameter` method:

```typescript
deliveryClient.items<Movie>()
  .customParameter('customParam', 'customVal')
  .getObservable()
  .subscribe(response => console.log(response));
```

### Getting localized items

You can specify the [language of items](https://developer.kenticocloud.com/v1/docs/localization) with `languageParameter` of a particular query. You can also specify default language that will be used if `languageParameter` is not used during the initialization of delivery client.

```typescript
import { DeliveryClient } from 'kentico-cloud-delivery';
import { Movie } from './movie'; // use your own path to movie class model

var deliveryClient = new DeliveryClient({
  projectId: 'xxx',
  defaultLanguage: 'es'
});

// gets items in 'es' language because it is marked as default
deliveryClient.item<Movie>('warrior')
  .getObservable()
  .subscribe(response => console.log(response));

// gets items in 'en' language because language parameter has priority over the default one
deliveryClient.item<Movie>('warrior')
  .languageParameter(`en`)
  .getObservable()
  .subscribe(response => console.log(response));
```

### Property binding in models

Kentico Cloud returns all element names in **lowercase**. Because Javascript properties are case sensitive, the binding will fail if your property is called, for example, *firstName*. You can either use **codename() decorator** that comes with the SDK, or use the custom resolver:

```typescript
import { ContentItem, Fields, FieldDecorators  } from 'kentico-cloud-delivery';

export class Actor extends ContentItem {

  @FieldDecorators.codename('firstname')
  public firstName: Fields.TextField;
  public lastName: Fields.TextField;
  public bio: Fields.RichTextField;

    constructor() {
    super({
      propertyResolver: ((fieldName: string) => {
        if (fieldName === 'lastname') {
          return 'lastName';
        }
        return fieldName;
      })
    });
  }
}
```

### Preview mode

You can enable the preview mode either globally (when initializing the DeliveryClient) or per query. For example, you might disable preview mode globally, but enable it for one particular query for testing purposes. In each case, you need to set `previewApiKey` in the delivery client global configuration.

#### Enabling preview mode globally

```typescript
import { DeliveryClient } from 'kentico-cloud-delivery';

const deliveryClient = new DeliveryClient({
  enablePreviewMode: true,
  projectId = 'xxx';
  previewApiKey: 'yyy'
});
```

#### Enabling preview mode per query

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .queryConfig({
    usePreviewMode: true
  })
  .getObservable()
  .subscribe(response => console.log(response));
```

### Secured delivery API mode

**Important:** Using secured delivery API is recommend only in cases where the query is not run on a client because otherwise you will expose the API Key publicly. For example, using secured delivery API in a node.js is ok, but using it in a web application is not because anyone could see the key.

```typescript
import { DeliveryClient } from 'kentico-cloud-delivery';

const deliveryClient = new DeliveryClient({
  projectId = 'xxx';
  enableSecuredMode: true,
  securedApiKey: 'yyy'
});
```

As with preview mode, you can also override global settings on query level:

```typescript
deliveryClient.items<Movie>()
  .type('movie')
  .queryConfig({
    useSecuredMode: true
  })
  .getObservable()
  .subscribe(response => console.log(response));
```

### URL Slugs (links)

#### Resolving URL slugs (links) globally

The URL slugs (links) can be resolved in `URLSlugField` or `RichTextField` fields. The way how links are resolved depends on the `linkResolver` which can be defined either globally in model definition, or by using the `queryConfig` method of a particular api call. The query resolver has priority over the globally defined one. 

To access the URL, call `getUrl` method.

Note that when resolving links in RichTextField, you resolve all of them with a single link resolver. For this reason, it is recommended that you specify the `type` of the content type you want to resolve.

```typescript
import { ContentItem, Fields, ILink } from 'kentico-cloud-delivery';

export class Actor extends ContentItem {
  public title: Fields.TextField;
  public slug: Fields.UrlSlugField;

    constructor() {
    super({
      linkResolver: (link: ILink) => {
        return `/actors/${url_slug}`;
      }
    })
  }
}

// get url 
deliveryClient.item<Actor>('tom_hardy')
  .getObservable()
  .subscribe(response => console.log(response.item.slug.getUrl()));
```

#### Resolving URL slugs (links) per query

```typescript
import { ContentItem, Fields, ILink } from 'kentico-cloud-delivery';

deliveryClient.item<Actor>('tom_hardy')
  .queryConfig({
    linkResolver: (link: ILink) => {
        if (link.type === 'actor'){
          return `/actors/${urlSlug}`;
        }
        else if (link.type === 'movie'){
          return `/movies/${urlSlug}`;
        }
        return 'unkown-type';
      }
  })
  .getObservable()
  .subscribe(response => console.log(response.item.slug.getUrl()));
```

### Resolving modular content in Rich text fields

If you have a modular content item inside a Rich text element, you need to define how each content type resolves to the HTML that will be rendered. This can be done globally for each type using the `richTextResolver` option, or per query. The following example shows how to resolve the `Actor` modular items used in all your rich text fields.

#### Globally

```typescript
import { ContentItem, Fields } from 'kentico-cloud-delivery';

class Actor extends ContentItem {
  public name: Fields.TextField;

  constructor() {
    super({
        richTextResolver: (item: Actor) => {
          return `<h3>${item.name.text}</h3>`;
        }
      })
    }
}

class Movie extends ContentItem {
  public title: Fields.TextField;
  public plot: Fields.RichTextField;
}

deliveryClient.item<Movie>('pain_and_gain')
  .getObservable()
  .subscribe(response => {
    console.log(response.item.plot.getHtml());
    // Example output:
    // {html from your rich text field before the modular content}
    // <h3>Dwayne Johsnon</h3>
    // {html from your rich text field after the modular content}
  });
```

#### Locally per query

You can define a resolver for a particular query. Resolver defined this way has priority over the globally defined one.

```typescript
import { IContentItem } from 'kentico-cloud-delivery';

deliveryClient.item<Movie>('pain_and_gain')
    queryConfig({
      richTextResolver: (item: IContentItem) => {
        if (item.system.type == 'actor') {
          var actor = item as Actor;
          return `<h2>${actor.name.text}</h2>`;
        }
    })
  })
  .getObservable()
  .subscribe(response => {
    console.log(response.item.plot.getHtml());
    // Example output:
    // {html from your rich text field before the modular content}
    // <h3>Dwayne Johsnon</h3>
    // {html from your rich text field after the modular content}
  });
```

### Strongly typed nested property (TypeScript only)

To include modular content, simply reference a given type class:

```typescript
import { ContentItem, Fields} from 'kentico-cloud-delivery';

export class Actor extends ContentItem {
  public name: Fields.TextField;
}

export class Movie extends ContentItem {
  public title: Fields.TextField;
  public stars: Actor[];
}
```

## Getting content types

To retrieve information about your content types, you can use the `type` and `types` methods.

```typescript
deliveryClient
  .type('movie') // codename of the type
  .getObservable()
  .subscribe(response => console.log(response));

deliveryClient.types()
  .getObservable()
  .subscribe(response => console.log(response));
```

## Working with taxonomies

To retrieve information about your taxonomies, you can use the `taxonomy` and `taxonomies` methods.

```typescript
deliveryClient  
  .taxonomy('taxonomyGroupName') // codename of the Taxonomy group
  .getObservable()
  .subscribe(response => console.log(response));
  });  

deliveryClient  
  .taxonomies()
  .getObservable()
  .subscribe(response => console.log(response));
  });
```

## Client configuration 

Following is a list of configuration options for DeliveryClient (`IDeliveryClientConfig`):

| Property        | type| description|
| ------------- |:-------------:| -----:|
| projectId      | string | ProjectId of your Kentico Cloud project|
| typeResolvers| TypeResolver[] | List of resolvers that are used to create strongly typed objects from Kentico Cloud response|
| enableAdvancedLogging| boolean | Indicates if advanced (developer's) issues are logged in console. Enable for development and disable in production.|
| previewApiKey| string| Preview API key used to get unpublished content items |
| enablePreviewMode| boolean| Indicates if preview mode is enabled globally. This can be overriden on query level|
| defaultLanguage| string| Sets default language that will be used for all queries unless overriden with query parameters|
| baseUrl| string| Can be used to configure custom base url (i.e. for testing) |
| basePreviewUrl| string| Can be used to configure custom preview url |
| securedApiKey| string| Secured API key: Use secured API only when running on Node.JS server, otherwise you can expose your key|
| enableSecuredMode| boolean| Indicates if secured mode is enabled globally. This can be overriden on query level |
| retryAttempts| number | Number of retry attempts when error occures. Defaults to '3'. Set to '0' to disable. |
| modularContentResolver.modularContentWrapperTag | string | HTML tag used to wrap resolved modular items in Rich text fields (defaults to 'p') |
| modularContentResolver.modularContentWrapperClasses | string[] | Array of classes added to modular item wrapper. Defaults to a single class 'kc-modular-item-wrapper' |

## Handling errors

Errors can be handled using the `error` parameter of the `subscribe` method (see [RxJS](https://github.com/ReactiveX/rxjs)) or by using the `catchError` rxjs parameter. If the error originates in Kentico Cloud (see [error responses](https://developer.kenticocloud.com/v1/reference#error-responses)), you will get a `CloudError` model with more specific information. Otherwise, you will get an original exception.

```typescript
import { CloudError } from 'kentico-cloud-delivery';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

deliveryClient.item<Movie>('terminator_9')
  .get()
  .subscribe(response => console.log(response), err => {
    if (err instanceof CloudError) {
      console.log(err.message); 
    }
    else {
      console.log(err);
    }
  });

deliveryClient.item<Movie>('terminator_9')
  .get()
  .pipe(
    catchError(error => {
      return throwError(error);
    })
  )
  .catch(err => {
      if (err instanceof CloudError) {
        console.log(err.message);
      }
      else {
        console.log(err);
      }
    return err;
  })
  .subscribe(response => console.log(response))
```

## Debugging

### Accessing request data

Every response from this SDK contains `debug` property which can be used to inspect raw response.

```typescript
deliveryClient.items<IContentItem>()
  .get()
  .subscribe(response => {
    console.log(response.debug); 
  });
```

### Getting URL of a query

In case you need to get the raw URL of a request before calling it, use the `getUrl()` method on any query.

```typescript
const queryText = deliveryClient.items<IContentItem>()
  .type('movie')
  .limitParameter(10)
  .orderParameter('system.codename', SortOrder.desc)
  .getUrl();

console.log(queryText);
// outputs:
// https://deliver.kenticocloud.com/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items?limit=10&order=system.codename[desc]&system.type=movie
```

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.
