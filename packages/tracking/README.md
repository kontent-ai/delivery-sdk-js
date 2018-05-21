# Kentico Cloud Tracking SDK


A client library for tracking data with [Kentico Cloud](https://kenticocloud.com/) in `Node` and `browsers`. Library supports `ES2015` and is fully written in `TypeScript`.

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

We strongly recommend using `Observable` instead of `Promise` as observables support all that Promises too, and much more. Using `Observables` is especially important if you are building any modern application (i.e. SPA with React or Angular) as it allows you to easily cancel requests, merge and flatten request or retry them very easily.  

When creating a subscription, don't forget to unsubcribe when you don't need the result anymore (i.e. when navigating to different page)

```typescript
client.recordNewSession({
    sid: 'x',
    uid: 'y',
})
    .getObservable()
    .subscribe();
```

### Usage with Promise

For whatever reason, you can still use good old Promises:

```typescript
client.recordNewSession({
    sid: 'x',
    uid: 'y',
})
    .getPromise()
    .then();
```

### Client configuration

| Property        | type| description|
| ------------- |:-------------:| -----:|
| projectId      | string | ProjectId of your Kentico Cloud project|
| enableAdvancedLogging| boolean | Indicates if advanced (developer's) issues are logged in console. Enable for development and disable in production.|
| baseUrl| string| Can be used to configure custom base url (i.e. for testing) |
| retryAttempts| number | Number of retry attempts when error occures. Defaults to '3'. Set to '0' to disable. |


