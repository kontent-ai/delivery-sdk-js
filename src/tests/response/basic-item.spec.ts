// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// real delivery client
import { realDeliveryClient } from '../setup/real-delivery-client';

// delivery client
import { DeliveryClient, DeliveryItemResponse } from '../../../lib';

// models
import { Actor } from '../setup/actor.class';
import { Movie } from '../setup/movie.class';

// tests
describe('Basic content item', () => {

  var movieResponse: DeliveryItemResponse<Movie>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DeliveryClient, useValue: realDeliveryClient,
        },
      ]
    });

    var movieCodename: string = 'warrior';

    let deliveryClient = TestBed.get(DeliveryClient) as DeliveryClient;

    deliveryClient.item<Movie>(movieCodename)
      .get()
      .subscribe(response => {
        movieResponse = response as DeliveryItemResponse<Movie>;
        done();
      });
  });

  it(`item response should be defined`, () => {
    expect(movieResponse).toBeDefined();
  });

  it(`item should be defined`, () => {
    expect(movieResponse.item).toBeDefined();
  });

  it(`item should be instance of 'Movie' class`, () => {
    expect(movieResponse.item).toEqual(jasmine.any(Movie));
  });
});

