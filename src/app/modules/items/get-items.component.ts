import { Component, OnInit } from '@angular/core';

// models
import { CodeExample } from '../../models/code-example.class';
import { Character } from '../../models/character.class';

// k cloud
import {
  DeliveryClient,
  LimitParameter, DepthParameter,
  ElementsParameter, SkipParameter,
  EqualsFilter, AllFilter, AnyFilter, ContainsFilter, GreaterThanFilter,
  GreaterThanOrEqualFilter, Infilter, LessThanFilter, LessThanOrEqualFilter,
  RangeFilter, ItemQueryConfig, IContentItem
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


    this.deliveryClient.getItem<Character>('character', 'rick', null,
      {
        richTextResolver: (item: IContentItem) => {
          if (item.system.type == 'character') {
            var character = item as Character;
            return `<h2>${character.name.text}</h2>`;
          }
        }
      }).subscribe(response => {
        console.log(response);
        console.log(response.item.someRichText.getHtml());
      });


    this.deliveryClient.getItems<CodeExample>(this.type, [
      new LimitParameter(5),
      new SkipParameter(1),
      new DepthParameter(5),
      // new ElementsParameter(["title", "author", "category", "image", "name", "category_name"]),
      // new OrderDescParameter("elements.title")
      // new EqualsFilter("elements.title", "Rick")
    ]).subscribe(response => {
      console.log(response);
      this.codeExamples = response.items;
    });

    this.deliveryClient.getItem<CodeExample>(this.type, 'changemacrorule_parameters', null, {
      urlSlugResolver: (contentItem: IContentItem, urlSlug: string) => {
        return "hello smurfies!";
      }
    }).subscribe(response => {
      console.log(response);
    });

    this.deliveryClient.getItem<CodeExample>(this.type, 'changemacrorule_parameters',
      [
        new DepthParameter(5)
      ],
      {
        usePreviewMode: true
      }).subscribe(response => {
        console.log(response);
        this.codeExample = response.item;
      });

  }
}