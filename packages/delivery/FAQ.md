# FAQ

## How to use delivery-js-sdk in react applications?

Currently, there is an issue with `react-scripts` package as it tries to minify all external dependencies, but is unable to handle ES6 code properly. You might see an error like this when building your react app:

```
Creating an optimized production build...
Failed to compile.

Failed to minify the code from this file:

        ./node_modules/parse5/lib/utils/mixin.js:3

Read more here: http://bit.ly/2tRViJ9
```

The reason you see this error is because the `parse5` dependency we use for HTML parsing does not publish ES5 code to npm and therefore the build fails. 

The best solution right now is to use `2.x.y alpha` version of `react-scripts` which resolves the ES6 code properly. You can find more details in [this issue](https://github.com/Enngage/kentico-cloud-js/issues/69). 

## Angular Universal and pre-render

By default, we use `axios` http client to make requests, but if you are using Angular Universal with pre-render feature, you need to use Angular's http client so that components are rendered correctly on page load. If you didn't use Angular's http client, components would might not contain your HTML in source of your page, although it would 'display' correctly to visitors.

The reason is that Angular does not wait for http requests to finish unless they are made with their built-in clients. 

You may solve it by installing `` npm package and then injecting this service in your delivery client:

```
npm i kentico-cloud-angular-http-service
```

```typescript
import { AngularHttpService } from 'kentico-cloud-angular-http-service';
```

```typescript
import { AngularHttpService } from 'kentico-cloud-angular-http-service';

  constructor(angularHttpService: AngularHttpService) {
    const deliveryClient = new DeliveryClient({
      projectId: 'xxx',
      httpService: angularHttpService
    });
  }
```

