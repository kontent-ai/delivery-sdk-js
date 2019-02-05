
# 6.0.0-beta.0 (2019-02-xx)

### Breaking changes

* **umd:** removes `rxjs` dependency from being bundled. From this moment you have to include `rxjs` before this sdk. 
* **umd:** exports delivery client sdk as `kenticoCloudDelivery` global variable

### Features

* **core:** dependency updated
* **rxjs:** dev dependency upgraded to `6.4.0` 

### Performance Improvements

* **umd:** reduced bundle size by approximately 35%.

### Tests

* **tooling:** Upgraded test dependencies and move to webpack and chrome for browser testing