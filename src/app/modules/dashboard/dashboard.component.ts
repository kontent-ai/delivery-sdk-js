import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { KCloudService, KCloudConfig, TypeResolver } from '../../../../index';

// models
import { Character } from '../../models/character.class';
import { Author } from '../../models/author.class';
import { Category } from '../../models/category.class';
import { CodeExample } from '../../models/code-example.class';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  private kCloudService: KCloudService;

  constructor(
    private http: Http,
  ) {
  }

  ngOnInit(): void {

    let apiUrl = 'https://deliver.kenticocloud.com';
    let projectId = 'b52fa0db-84ec-4310-8f7c-3b94ed06644d';

    let typeResolvers: TypeResolver[] = [
      new TypeResolver("code_example", () => new CodeExample()),
      new TypeResolver("category", () => new Category()),
      new TypeResolver("author", () => new Author()),
      new TypeResolver("character", () => new Character()),
    ];

    this.kCloudService = new KCloudService(
      this.http,
      new KCloudConfig(apiUrl, projectId, typeResolvers)
    )

    this.kCloudService.getItems("character").subscribe(response => console.log(response));

    //console.log(`result is: ${add(4,5)}`);
  }
}