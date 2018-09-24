
# Angular Http service

This is an implementation of the `IHttpService` that can be used instead of the default http service available in [https://www.npmjs.com/package/kentico-cloud-core](Core package) that uses `axios` package. 

This library uses Angular's `HttpClient` to make http requests and can be used only in Angular applications.

## Why and when should I use this library? 

In normal scenarios, you don't need to use this http service. However if you require `server side rendering with prerender` using Angular universal, you have to use Angular's built-in Http service because otherwise Angular will not wait until the requests are fetched from server and therefore your code would not be reflected in HTML of your page. You can find more information about the issue at[https://github.com/Enngage/kentico-cloud-js/blob/master/doc/delivery.md](https://github.com/Enngage/kentico-cloud-js/blob/master/doc/delivery.md)
