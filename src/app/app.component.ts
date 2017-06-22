import { Component, OnInit } from '@angular/core';
import { DeliveryClient, SortOrder, CloudError, ItemResponses } from '../../lib';
import { Actor } from './models/actor.class';
import { Movie } from './models/movie.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  appName = 'Kentico Cloud SDK Preview';

  constructor(
    private deliveryClient: DeliveryClient
  ) {
  }

  ngOnInit(): void {
    this.testQueries();
  }

  private testQueries(): void {
    var query = this.deliveryClient.items()
      .type('movie')
      .limitParameter(10)
      .orderParameter('system.codename', SortOrder.desc);

    query.get()
      .subscribe(response => console.log(response));
  }
}
