
# Angular Http service

This is an implementation of the `IHttpService` that can be used instead of the default http service available in [Core package](https://www.npmjs.com/package/kentico-kontent-core) that uses `axios` package. 

This library uses Angular's `HttpClient` to make http requests and can be used only in Angular applications.

## Why and when should you use this library? 

If you need to use `server side rendering with prerender` using Angular universal, you have to use Angular's built-in Http service because otherwise Angular will not wait until the requests are fetched from server and therefore your code would not be reflected in HTML of your page. You can find more information about the issue [here](https://github.com/Kentico/kentico-kontent-js/blob/master/doc/delivery.md)

## Example

First, you need to import `AngularHttpServiceModule` module into your `AppModule` (or other module depending on your architecture) and then you can inject `AngularHttpService` just as you are used to in Angular.

import { AngularHttpServiceModule } from 'kentico-kontent-angular-http-service';

```typescript
@NgModule({
  imports: [
    AngularHttpServiceModule,
    // other imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

and example taken from a component:

```typescript
  private readonly deliveryClient: IDeliveryClient;

  constructor(angularHttpService: AngularHttpService) {
    this.deliveryClient = new DeliveryClient({
      projectId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9',
      httpService: angularHttpService
    });
  }
```
