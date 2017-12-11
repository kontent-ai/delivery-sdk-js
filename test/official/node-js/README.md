## Official examples

This folder contains official examples used at [https://developer.kenticocloud.com/v1/reference#delivery-api](https://developer.kenticocloud.com/v1/reference#delivery-api)

### Javascript vs Node.js examples

All javascript examples written here use node-js to evaluate them. This is configured via initialization of `DeliveryClient`.

Node.js examples will use:

```javascript
const isNodeJs = true;
const deliveryClient = new KenticoCloud.DeliveryClient(config, isNodeJs);
```

Javascript examples run in browser will use:


```javascript
const isNodeJs = false;
const deliveryClient = new KenticoCloud.DeliveryClient(config, isNodeJs);
```

or simply:

```javascript
const deliveryClient = new KenticoCloud.DeliveryClient(config);
```
