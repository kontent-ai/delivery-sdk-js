# Kontent management javascript SDK

> Javascript SDK for the [Kontent Management](https://developer.kenticocloud.com/v1/reference#content-management-api-v2). Helps you manage content in your [Kentico Kontent](https://kontent.ai/) projects. Supports both `node.js` and `browsers`.

[![npm version](https://badge.fury.io/js/%40kentico%2Fkontent-management.svg)](https://badge.fury.io/js/%40kentico%2Fkontent-management)
[![Build Status](https://api.travis-ci.com/Kentico/kentico-kontent-js.svg?branch=master)](https://travis-ci.com/Kentico/kentico-kontent-js)
[![CircleCI](https://circleci.com/gh/Kentico/kentico-kontent-js/tree/master.svg?style=svg)](https://circleci.com/gh/Kentico/kentico-kontent-js/tree/master)
[![npm](https://img.shields.io/npm/dt/@kentico/kontent-management.svg)](https://www.npmjs.com/package/@kentico/kontent-delivery)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kentico-kontent-js/badge.svg)](https://snyk.io/test/github/kentico/kentico-kontent-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kentico-kontent-js.svg)](https://github.com/Kentico/kentico-kontent-js)
![Gzip bundle](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/@kentico/kontent-management/_bundles/kontent-management.umd.min.js?compression=gzip)
[![](https://data.jsdelivr.com/v1/package/npm/@kentico/kontent-management/badge)](https://www.jsdelivr.com/package/npm/@kentico/kontent-management)


## Getting started

To get started, you'll first need to have access to your [Kentico Kontent](https://kontent.ai/) project where you need to enable Content management API and generate `access token` that will be used to authenticate all requests made by this library.

### Installation

This library has a peer dependency on `rxjs`which means you need to install it as well. You install it using `npm` or use it directly in browser using one of the `cdn` bundles. 

#### npm

```
npm i rxjs --save
npm i @kentico/kontent-management --save
```

#### Using a standalone version in browsers

If you'd like to use this library directly in browser, place following script tags to your html page. You may of course download it and refer to local versions of scripts.

```javascript
<script src="https://cdn.jsdelivr.net/npm/rxjs/bundles/rxjs.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@kentico/kontent-management/_bundles/kontent-management.umd.min.js"></script>
```

### Making the first request

The following code example shows how to create new content item in your Kentico Kontent project.

```javascript
import { ManagementClient } from '@kentico/kontent-core';

const client = new ManagementClient({
        projectId: 'xxx', // id of your Kentico Kontent project
        apiKey: 'yyy', // Content management API token
    });

    client.addContentItem()
        .withData(
            {
                name: 'New article',
                type: {
                    codename: 'article' // codename of content type
                }
            }
        )
        .toObservable()
        .subscribe((response) => {
            // work with response
        },
        (error) => {
            // handle error
        });
```

If you are using `UMD` bundles directly in browsers, you can find this library under `KontentManagement` global variable. 

```html
<!DOCTYPE html>
<html>
<head>
	<title>Kontent management | jsdelivr cdn</title>
    <script src="https://cdn.jsdelivr.net/npm/rxjs/bundles/rxjs.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@kentico/kontent-management/_bundles/kontent-management.umd.min.js"></script>
</head>
<body>
    <script type="text/javascript">
        var KontentManagement = window['KontentManagement'];

		var client = new KontentManagement.ManagementClient({
			projectId: 'xxx',
			apiKey: 'yyy'
		});

		client.addContentItem()
            .withData(
                {
                    name: 'New article',
                    type: {
                        codename: 'article'
                    },
                }
            )
            .toObservable()
            .subscribe((response) => {
                // work with response
            },
            (error) => {
                // handle error
            });
	</script>
</body>
</html>
```

### Configuration

The `ManagementClient` contains several configuration options:

```javascript
const client = new ManagementClient({
    // configuration options
});
```

| Option  | Default | Description |
| ------------- | ------------- | ------------- |
| `projectId` | N/A | **Required** - Id of your Kentico Kontent project  |
| `apiKey` | N/A  | **Required** - Content management API Token  |
| `baseUrl` | https://manage.kontent.ai/v2/projects  | Base URL of REST api. Can be useful if you are using custom proxy or for testing purposes |
| `retryAttempts` | 3 |  Number of retry attempts when error occures. To disable set the value to 0. |
| `httpService` | HttpService  | Used to inject implementation of `IHttpService` used to make HTTP request across network. Can also be useful for testing purposes by returning specified responses. |
| `retryStatusCodes` | [500] | Array of request status codes that should be retried. |

### API Reference

Online [API Reference](https://kentico.github.io/kentico-kontent-js/content-management) documents latest version of this library and can be used to quickly find all exposed methods and objects. Documentation is generated from `TypeScript` code and thus it should always be accurate.

### Testing

> If you want to mock http responses, it is possible to use [external implementation of configurable Http Service](../core/README.md#testing) as a part of the [client configuration](#configuration).

### Troubleshooting & feedback

If you have any issues or want to share your feedback, please feel free to [create an issue](https://github.com/Kentico/kentico-kontent-js/issues/new/choose) in this GitHub repository.

### Contributions

Contributions are welcomed. If you have an idea of what you would like to implement, let us know and lets discuss details of your PR.
