# Upgrade

## Upgrading from `10.x.y` to `11.0.0`

- Output & bundle files were moved to `dist` folder. For example, minified UMD bundle is available in `dist/bundles/kontent-delivery.umd.min.js`.

## Upgrading from `5.x.y` to `6.0.0`

### IDeliveryClientConfig

There have been few changes to `IDeliveryClientConfig` interface, most notably the `usePreviewMode` and `useSecuredMode` were moved into `globalQueryConfig` which is used to set default query configuration for all queries. This configuration can be overriden by each query.

All proxy related configuration has been added to `proxy` property and there is a new ability to fully customize URLs (e.g. to hide projectId).

`GlobalHeaders` is now a function instead of a simple array - this is so that you can potentially call your own function to get global headers dynamically. Global headers are added to each request regardless of the headers specified in `globalQueryConfig`

Updated syntax looks like:

```typescript
const client = new DeliveryClient({
    projectId: '<projectId>',
    defaultLanguage: 'en-GB',
    globalHeaders: (queryConfig) => [{
        header: 'headerName',
        value: 'value'
    }],
    previewApiKey: '<key>',
    secureApiKey: '<key>',
    proxy: {
        baseUrl: 'http://www.base.io',
        basePreviewUrl: 'http://www.preview.io',
        advancedProxyUrlResolver: (proxyData) => {
            // omits 'projectId' from request urls
            return `http://proxy.io${proxyData.action}${proxyData.queryString}`
        }
    },
    typeResolvers: [
        // TypeResolvers now contain raw data that you can use in your classes
        // to set custom properties or to conditionally initialize models
        new TypeResolver('type', (rawData) => new MyClass(rawData))
    ],
    retryAttempts: 3,
    // globalQueryConfig sets default values for each config
    // which can be overriden by individual queries
    globalQueryConfig:  {
        customHeaders: [], // adds array of default headers
        usePreviewMode: true, // uses preview mode by default
        useSecuredMode: false, // disabled secured mode by default
        waitForLoadingNewContent: true // adds 'X-KC-Wait-For-Loading-New-Content' by default
    }
});
```

### Promise & promise retrieval

Following methods were renamed:

- `getPromise` -> `toPromise`
- `getPromise` -> `toPromise` 

If you had a code such as:

```typescript
client.items().getPromise();
client.items().getPromise();
```

you have to use new methods such as 

```typescript
client.items().toPromise();
client.items().toPromise();
```

### Updated element naming convention

The word `Field` was replaced with `Element` across all methods/properties/classes/namespaces to be better aligned with Delivery API terminology. 

Most common changes will relate to your models:

- `Fields.TextField` -> `Elements.TextElement`
- `Fields.MultipleChoiceField` -> `Elements.MultipleChoiceElement`
- `Fields.DateTimeField` -> `Elements.DateTimeElement`
- `Fields.RichTextField` -> `Elements.RichTextElement`
- `Fields.NumberField` -> `Elements.NumberElement`
- `Fields.AssetsField` -> `Elements.AssetsElement`
- `Fields.UrlSlugField` -> `Elements.UrlSlugElement`
- `Fields.TaxonomyField` -> `Elements.TaxonomyElement`
- `Fields.CustomField` -> `Elements.DefaultCustomElement`

### Linked items mapping in modes

In version `5.x.y` linked items were mapped as an array so you might have something like:

```typescript
export class Movie extends ContentItem {
  public actors!: Actor[];

  constructor() {
    super();
  }
}
```

Version `6.0.0` introduced new `Elements.LinkedItemsElement<T>` which you can need to use instead:

```typescript
export class Movie extends ContentItem {
  public actors!: Elements.LinkedItemsElement<Actor>;

  constructor() {
    super();
  }
}
```

### Removal of type specific element properties

In version `5.x.y` some elements had dedicated properties such as:

```typescript
const numberField: Fields.NumberField;
const value = numberField.number;

const textField: Fields.TextField;
const value = textField.text;

const dateTimeField: Fields.DateTimeField;
const value = dateTimeField.datetime;
```

This has been unified in version `6.0.0` so that every element now has a `value` property instead:

```typescript
const numberField: Elements.NumberElement;
const value = numberField.value;

const textField: Elements.TextElement;
const value = textField.value;

const dateTimeField: Elements.DateTimeElement;
const value = dateTimeField.value;
```

The only exception to this is `Elements.RichTextElement` and `Elements.UrlSlugElement` which contain dedicated methods `resolveHtml` and `resolveUrl`. 


### Linked items in listing response

In version `5.x.y` the delivery listing model contained a property `linkedItems` which represented an array of all linked items in response (in API this equals to `modular_content` property). 

Version `6.0.0` changed this so that you get an object where linked items are added by their codenames. This is represented by `IContentItemsContainer<TItem>` interface with proper indexer:

```typescript
export interface IContentItemsContainer<TItem extends IContentItem = IContentItem> {
    [key: string]: TItem;
}
```

To get a linked item with codename `warrior`, you would now use a code like:

```typescript
const listingResponse: ItemResponses.ListContentItemsResponse = await client.items().toPromise();
const linkedItem: ContentItem = listingResponse.linkedItems['warrior'];
```

If you want to convert linked items back to an array, you can use code like this:

```typescript
const linkedItems: ContentItem[] = Object.keys(response.linkedItems).map(key => response.linkedItems[key]);
```

### Updated response model names

All responses were unified to match API endpoints and official documentation. The list of new response models include:

- `ItemResponses.ListContentItemsResponse<T>`
- `ItemResponses.ViewContentItemResponse`

- `TypeResponses.ListContentTypesResponse`
- `TypeResponses.ViewContentTypeResponse`

- `ElementResponses.ViewContentTypeElementResponse`

- `TaxonomyResponses.ListTaxonomyGroupsResponse`
- `TaxonomyResponses.ViewTaxonomyGroupResponse`

### Rich text resolving

Previously, the html was resolved by calling `getHtml` method. This has been changed to `resolveHtml`. 

Old: 

```typescript
client.item('warrior')
    queryConfig({
      richTextResolver: (item, context) => {
        if (item.system.type == 'actor') {
          return `<h2>${actor.name.value}</h2>`;
        }
    })
  })
  .toPromise()
  .subscribe(response => {
    console.log(response.item.plot.getHtml());
  });
```

New: 

```typescript
client.item('warrior')
    queryConfig({
      richTextResolver: (item, context) => {
        if (item.system.type == 'actor') {
          return `<h2>${actor.name.value}</h2>`;
        }
    })
  })
  .toPromise()
  .subscribe(response => {
    console.log(response.item.plot.resolveHtml());
  });
```

### Url resolving 

Previously, the url in Url slug elements was resolved by calling `getUrl` method. This has been changed to `resolveUrl`. 

Old:

```typescript
export class Actor extends ContentItem {
  public title: Fields.TextField;
  public slug: Fields.UrlSlugField;

    constructor() {
    super({
      linkResolver: (link, context) => {
        return `/actors/${link.urlSlug}`;
      }
    })
  }
}

deliveryClient.item<Actor>('tom_hardy')
  .toPromise()
  .subscribe(response => console.log(response.item.slug.getHtml()));
```

New:

```typescript
export class Actor extends ContentItem {
  public title: Elements.TextElement;
  public slug: Elements.UrlSlugElement;

    constructor() {
    super({
      urlSlugResolver: (link, context) => {
        return { url: `/actors/${urlSlug.urlSlug}` };
      }
    })
  }
}

deliveryClient.item<Actor>('tom_hardy')
  .toPromise()
  .subscribe(response => console.log(response.item.slug.resolveUrl()));
```

### Changes to `linkResolver`

`linkResolver` was renamed to `urlSlugResolver` and its return type was changed to `IUrlSlugResolverResult`:

```typescript
export interface IUrlSlugResolverResult {
    html?: string;
    url?: string;
}
```

Old: 

```typescript
class Movie extends ContentItem {
  public title!: Elements.TextElement;
  public plot!: Elements.RichTextElement;

  constructor() {
    super({
      linkResolver: (link, context) => {
        return 'actors/' + link.urlSlug;
      }
    });
  }
}
```

New: 

```typescript
class Movie extends ContentItem {
  public title!: Elements.TextElement;
  public plot!: Elements.RichTextElement;

  constructor() {
    super({
      urlSlugResolver: (link, context) => {
        return {
          url: 'actors/' + link.urlSlug
        };
      }
    });
  }
}
```

### Content item debug data

In version `5.x.y` content items had a property `elements` which contained raw data fetched from Delivery API. This has been moved to `_raw.elements`.  

Old:

```typescript
const item: ContentItem = await client.item('x').getPromise();
const rawTitleElement = item.elements.title;
```

New:

```typescript
const item: ContentItem = await client.item('x').toPromise();
const rawTitleElement = item._raw.elements.title;
```



