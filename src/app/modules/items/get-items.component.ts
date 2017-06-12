import { Component, OnInit } from '@angular/core';

// models
import { CodeExample } from '../../models/code-example.class';
import { Character } from '../../models/character.class';

// k cloud
import {
  DeliveryClient, ItemQueryConfig, IContentItem, SortOrder
} from '../../../../lib';

@Component({
  templateUrl: 'get-items.component.html',
})
export class GetItemsComponent implements OnInit {

  private readonly type = "code_example";

  private codeExamples: CodeExample[];
  private codeExample: CodeExample;
  private characters: Character[];

  private richTextHtml: string;

  constructor(
    private deliveryClient: DeliveryClient,
  ) {
  }

  ngOnInit(): void {



    this.testQueries()
  }

  private testQueries(): void {
    var queryText = this.deliveryClient.items()
      .toString();

    var query1 = this.deliveryClient.items<Character>()
      .limitParameter(1)
      .queryConfig({
        usePreviewMode: true
      })
      .type('character');

    var query2 = this.deliveryClient.items<Character>()
      .type('character');

    var query3 = this.deliveryClient.item<Character>('rick')
      .queryConfig({
        richTextResolver: (item: IContentItem) => {
          if (item.system.type == 'character') {
            var character = item as Character;
            return `<h2>${character.name.text}</h2>`;
          }
        }
      });

    var query4 = this.deliveryClient.types();

    var query5 = this.deliveryClient.type('character');

    console.log(queryText);

    query1.get()
      .subscribe(response => console.log(response));

    query2.get()
      .subscribe(response => console.log(response));

    query3.get()
      .subscribe(response => console.log(response));

    query4.get()
      .subscribe(response => console.log(response));

    query5.get()
      .subscribe(response => console.log(response));
  }
}