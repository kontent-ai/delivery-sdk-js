import { Component, OnInit } from '@angular/core';

// delivery client
import { DeliveryClient } from '../../../../index';

// models
import { Character } from '../../models/character.class';


// query params
import { LimitParameter } from '../../../../index';

// filters
import { EqualsFilter } from '../../../../index';

@Component({
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  constructor(
    private deliveryClient: DeliveryClient
  ) {
  }

  ngOnInit(): void {
    this.deliveryClient.getItems<Character>("character").subscribe(response => console.log(response));

    // query params
    this.deliveryClient.getItems<Character>("character",
      [
        new LimitParameter(5)
      ])
      .subscribe(response => console.log(response));

    // filtering
    this.deliveryClient.getItems<Character>("character",
      [
        new EqualsFilter("elements.name", "Rimmer")
      ])
      .subscribe(response => console.log(response));

    // content types
    this.deliveryClient.getTypes().subscribe(response => console.log(response));

    // content type
    this.deliveryClient.getType("character").subscribe(response => console.log(response));
  }
}