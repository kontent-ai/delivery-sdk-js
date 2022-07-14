# FAQ

## Angular Universal and pre-render

By default, we use `axios` http client to make requests, but if you are using Angular Universal with pre-render feature, you need to use Angular's http client so that components are rendered correctly on page load. If you didn't use Angular's http client, components would might not contain your HTML in source of your page, although it would 'display' correctly to visitors.

The reason is that Angular does not wait for http requests to finish unless they are made with their built-in clients. 

You may solve it by installing `` npm package and then injecting this service in your delivery client:

```
npm i kentico-kontent-angular-http-service
```

```typescript
import { AngularHttpService } from 'kentico-kontent-angular-http-service';
```

```typescript
import { AngularHttpService } from 'kentico-kontent-angular-http-service';

  constructor(angularHttpService: AngularHttpService) {
    const deliveryClient = new DeliveryClient({
      projectId: 'xxx',
      httpService: angularHttpService
    });
  }
```

