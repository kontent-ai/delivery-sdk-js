// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// real delivery client
import { realDeliveryClient } from '../setup/real-delivery-client';

// delivery client
import {
  DeliveryClient, DeliveryItemResponse, AssetsField, DateTimeField,
  MultipleChoiceField, NumberField, RichTextField, TextField, UrlSlugField
} from '../../../lib';

// models
import { Movie } from '../setup/movie.class';
import { Actor } from '../setup/actor.class';

// tests
describe('Fields', () => {

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

  // field types

  it(`check 'TextField' type`, () => {
    expect(movieResponse.item.title).toEqual(jasmine.any(TextField));
  });

  it(`check 'RichTextField' type`, () => {
    expect(movieResponse.item.plot).toEqual(jasmine.any(RichTextField));
  });

  it(`check 'DateTimeField' type`, () => {
    expect(movieResponse.item.released).toEqual(jasmine.any(DateTimeField));
  });

  it(`check 'NumberField' type`, () => {
    expect(movieResponse.item.length).toEqual(jasmine.any(NumberField));
  });

  it(`check 'MultipleChoiceField' type`, () => {
    expect(movieResponse.item.category).toEqual(jasmine.any(MultipleChoiceField));
  });

  it(`check that 'stars' property contains objects of 'Actor' type`, () => {
    expect(movieResponse.item.stars[0]).toEqual(jasmine.any(Actor));
  });

   it(`check 'UrlSlugField' type`, () => {
    expect(movieResponse.item.seoname).toEqual(jasmine.any(UrlSlugField));
  });

  // misc

  it(`check that 'stars' property contains exactly 2 actor objects`, () => {
    expect(movieResponse.item.stars.length).toEqual(2);
  });


});

