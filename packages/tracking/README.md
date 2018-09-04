[![npm version](https://badge.fury.io/js/kentico-cloud-tracking.svg)](https://www.npmjs.com/package/kentico-cloud-tracking)
[![Build Status](https://api.travis-ci.org/Enngage/kentico-cloud-js.svg?branch=master)](https://travis-ci.org/Enngage/kentico-cloud-tracking)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-tracking.svg)](https://www.npmjs.com/package/kentico-cloud-tracking)
![Gzip browser bundle](http://img.badgesize.io/https://unpkg.com/kentico-cloud-tracking@latest/_bundles/kentico-cloud-tracking-sdk.umd.min.js?compression=gzip)

# Kentico Cloud Tracking SDK


A client library for manually tracking visitor data with [Kentico Cloud](https://kenticocloud.com/) in `Node` and `browsers`. Abstracts calls to the Kentico Cloud Tracking API. For more information, see the [Tracking API Reference](https://developer.kenticocloud.com/v1/reference#tracking-api).

The library supports ES2015 and is fully written in TypeScript.

## Installation

```
npm i rxjs --save
npm i kentico-cloud-tracking --save
```

## Initialization

```typescript
import { TrackingClient } from 'kentico-cloud-tracking';

const client = new TrackingClient({
    projectId: 'xxx',
);
```

## Usage with RxJS (recommended)

We strongly recommend using `Observable` instead of `Promise` as observables support all that Promises too, and much more. Using `Observables` is especially important if you are building any modern application (for example, single page apps with React or Angular) as it allows you to easily cancel, merge, flatten or retry requests.  

After creating a subscription, don't forget to unsubscribe when you don't need the result anymore (for example, when navigating to a different page).

```typescript
// Starts a new session
client.recordNewSession({
    sid: '111114cc62300000',
    uid: '1111136b4af00000',
})
    .getObservable()
    .subscribe();
    
// Record a custom activity
client.recordCustomActivity({
    sid: '111114cc62300000',
    uid: '1111136b4af00000'
  }, 
"Clicked_facebook_icon")
  .getObservable()
  .subscribe();


// Creates a contact profile
client.createContactProfile({
  sid: '111114cc62300000',
  uid: '1111136b4af00000',
  email: "john.snow@wall.north",
  name: "John Snow",
  company: "Night's Watch",
  phone: "444-256-487",
  website: "http://gameofthrones.wikia.com/wiki/Jon_Snow"
})
  .getObservable()
  .subscribe();
```

## Usage with Promise

For whatever reason, you can still use good old Promises:

```typescript
client.recordNewSession({
    sid: '1111136b4af00000',
    uid: '111114cc62300000',
})
    .getPromise()
    .then();
```

## Client configuration

| Property        | type| description|
| ------------- |:-------------:| -----:|
| projectId      | string | ProjectId of your Kentico Cloud project|
| enableAdvancedLogging| boolean | Indicates if advanced (developer's) issues are logged in the console. Enable for development and disable in production.|
| baseUrl| string| Can be used to configure custom base URL (e.g., for testing) |
| retryAttempts| number | Number of retry attempts when an error occurs. Defaults to '3'. Set to '0' to disable. |
| httpService      | IHttpService | Can be useud to inject custom http service for performing requests |

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Enngage/kentico-cloud-js/master/packages/tracking/README.md?pixel)
