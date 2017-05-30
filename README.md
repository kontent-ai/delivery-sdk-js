# Kentico Cloud SDK for Angular 2

Developer's SDK for [KenticoCloud](https://kenticocloud.com/)

#### Installation

```
npm install kentico-cloud-angular2-sdk --save
```

#### Create model

```
import { BaseItem, TextField, NumberField, RichTextField, DateTimeField } from 'kentico-cloud-angular2-sdk';

export class Character extends BaseItem {
  public name: TextField;

  constructor() {
    super()
  }
}
```

#### Setup factory provider for DeliveryClient

```
// core
import { Http } from '@angular/http';

// kentico cloud
import { DeliveryClient, DeliveryClientConfig, TypeResolver } from 'kentico-cloud-angular2-sdk';

// models
import { Character } from './character.class';

export function DeliveryClientFactory(http: Http) {

    let apiUrl = 'https://deliver.kenticocloud.com';
    let projectId = 'yourProjectId';

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("character", () => new Character()),
    ];

    return new DeliveryClient(
        http,
        new DeliveryClientConfig(apiUrl, projectId, typeResolvers)
    )
};

export var DeliveryClientProvider =
    {
        provide: DeliveryClient,
        useFactory: DeliveryClientFactory,
        deps: [Http]
    };

```

#### Use factory provider in app.module

```
import { DeliveryClientFactory } from 'your-delivery-factory-provider';

@NgModule({
  providers: [
    DeliveryClientFactory
  ],
  bootstrap: [AppComponent],
})
```

##### Use in your component

```
import { Component, OnInit } from '@angular/core';

// delivery client
import { DeliveryClient } from 'kentico-cloud-angular2-sdk';

// models
import { Character } from 'character.class';

@Component({
  templateUrl: 'sample.component.html',
})
export class SampleComponent implements OnInit {

  constructor(
    private deliveryClient: DeliveryClient
  ) {
  }

  ngOnInit(): void {
    this.deliveryClient.getItems<Character>("character").subscribe(response => console.log(response));
  }
}
```


##### Notes

- Only `Delivery API` is supported

