import { Component, OnInit } from '@angular/core';

// delivery client
import { DeliveryClient, LimitParameter, EqualsFilter, OrderParameter, SortOrder, ContentItem } from '../../../../index';

// models
import { Character } from '../../models/character.class';

@Component({
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  constructor(
    private deliveryClient: DeliveryClient
  ) {
  }

  ngOnInit(): void {
    this.deliveryClient.getItems<ContentItem>().subscribe(response => console.log(response));
  }


  private testRequests(): void {
    // multiple items
    this.deliveryClient.getItems<Character>("character").subscribe(response => console.log(response));

    // single item
    this.deliveryClient.getItem<Character>("character", "rick").subscribe(response => console.log(response));

    // content types
    this.deliveryClient.getTypes().subscribe(response => console.log(response));

    // content type
    this.deliveryClient.getType("character").subscribe(response => console.log(response));
  }

  private allRequests(): void {

    this.deliveryClient.getItems<Character>("character",
      [
        new OrderParameter("elements.name", SortOrder.desc)
      ]
    ).subscribe(response => console.log(response));

    this.deliveryClient.getItems<Character>("character").subscribe(response => console.log(response));

    this.deliveryClient.getItem<Character>("character", "rick").subscribe(response => console.log(response));

    // query params
    this.deliveryClient.getItems<Character>("character",
      [
        new LimitParameter(5)
      ])
      .subscribe(
      response => console.log(response)
      );

    // filtering
    this.deliveryClient.getItems<Character>("character",
      [
        new EqualsFilter("elements.name", "Rick")
      ])
      .subscribe(response => console.log(response));

    // content types
    this.deliveryClient.getTypes().subscribe(response => console.log(response));

    // content type
    this.deliveryClient.getType("character").subscribe(response => console.log(response));
  }

  private errorRequests(): void {
    // single item
    this.deliveryClient.getItem<Character>("character", "invalidiItem") // throws 404
      .subscribe(
      response => console.log(response),
      err => console.log(err) // handle error
      );

    // single item
    this.deliveryClient.getItem<Character>("character", "invalidiItem") // throws 404
      .catch(err => {
        console.log(err);
        throw err;
      })
      .subscribe(
      response => console.log(response),
    );
  }
}