import { Component, OnInit } from '@angular/core';

// delivery client
import { DeliveryClient } from '../../../../index';

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
    this.deliveryClient.getItems<Character>("character").subscribe(response => console.log(response));
  }
}