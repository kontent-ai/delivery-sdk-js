
# Angular Http service

This is an implementation of the `IHttpService` that can be used instead of the default http service available in [Core package](https://www.npmjs.com/package/kentico-cloud-core) that uses `axios` package. 

This library uses Angular's `HttpClient` to make http requests and can be used only in Angular applications.

## Why and when should you use this library? 

If you need to use `server side rendering with prerender` using Angular universal, you have to use Angular's built-in Http service because otherwise Angular will not wait until the requests are fetched from server and therefore your code would not be reflected in HTML of your page. You can find more information about the issue [here](https://github.com/Enngage/kentico-cloud-js/blob/master/doc/delivery.md)
