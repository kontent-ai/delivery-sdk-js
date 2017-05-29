# Kentico Cloud SDK for Angular 2

Developer's SDK for [KenticoCloud](https://kenticocloud.com/)

#### Installation

```
npm install kentico-cloud-angular2-sdk --save
```

#### Create models

```
import { BaseItem } from 'kentico-cloud-angular2-sdk';
import { TextField, NumberField, AssetsField, RichTextField, DateTimeField } from 'kentico-cloud-angular2-sdk';

export class Character extends BaseItem {
  public name: TextField;
  public someNumber: NumberField;
  public someDateTime: DateTimeField;
  public someRichText: RichTextField;

  public resolver = ((fieldName: string) => {
    if (fieldName === 'somenumber') {
      return 'someNumber';
    }
    else if(fieldName === 'somedate'){
      return 'someDateTime';
    }
    else if(fieldName === 'somerichtext'){
      return 'someRichText';
    }
  });

  constructor() {
    super()
  }
}
```

#### Create factory provider

```
// core
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

// kentico cloud
import { KCloudService, KCloudConfig, TypeResolver } from 'kentico-cloud-angular2-sdk';

// models
import { Character } from '../models/character.class';

export function KCloudServiceFactory(http: Http) {

    let apiUrl = 'https://deliver.kenticocloud.com';
    let projectId = 'b52fa0db-84ec-4310-8f7c-3b94ed06644d';

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("character", () => new Character()),
    ];

    return new KCloudService(
        http,
        new KCloudConfig(apiUrl, projectId, typeResolvers)
    )
};

export var KCloudServiceProvider =
    {
        provide: KCloudService,
        useFactory: KCloudServiceFactory,
        deps: [Http]
    };

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        KCloudService,
    ],
})
export class KenticoCloudModule { }
```

#### Register in your app.module

```
import { KCloudServiceProvider } from './setup/kcloud.service.provider';

@NgModule({
  providers: [
    KCloudServiceProvider
  ],
  bootstrap: [AppComponent],
})
```

##### Use in your component

```
import { Component, OnInit } from '@angular/core';

import { KCloudService } from 'kentico-cloud-angular2-sdk';

// models
import { Character } from '../../models/character.class';
import { Author } from '../../models/author.class';
import { Category } from '../../models/category.class';
import { CodeExample } from '../../models/code-example.class';

@Component({
})
export class SampleComponent implements OnInit {

  private kCloudService: KCloudService;

  constructor(
    private kCloudService: KCloudService,
  ) {
  }

  ngOnInit(): void {
    this.kCloudService = new KCloudService(
      this.http,
      new KCloudConfig(apiUrl, projectId, typeResolvers)
    )

    this.kCloudService.getItems("character").subscribe(response => console.log(response));
  }
}
```


##### Notes

- Only `Delivery API` is supported

