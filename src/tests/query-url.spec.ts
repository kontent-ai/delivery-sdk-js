// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// fake delivery client
import { fakeDeliveryClient } from './fakes/fake-delivery-client';

// delivery client
import { DeliveryClient } from '../../lib';

// tests
describe('Base URL tests', () => {

  var itemsUrl: string;
  var parsedUrl: URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DeliveryClient, useValue: fakeDeliveryClient,
        },
      ]
    });

    let deliveryClient = TestBed.get(DeliveryClient);
    itemsUrl = deliveryClient.items().toString();

    parsedUrl = new URL(itemsUrl);
  });

  it(`url should be defined`, () => expect(itemsUrl).toBeDefined());

  it(`parsed url should be defined`, () => expect(parsedUrl).toBeDefined());

  it(`protocol should be 'https:'`, () => expect(parsedUrl.protocol).toEqual('https:'));

  it(`host should be 'deliver.kenticocloud.com'`, () => expect(parsedUrl.host).toEqual('deliver.kenticocloud.com'));

  it(`origin should be 'https://deliver.kenticocloud.com'`, () => expect(parsedUrl.origin).toEqual('https://deliver.kenticocloud.com'));

  it(`pathname should be '/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items'`, () => {
    console.log(parsedUrl);
    expect(parsedUrl.pathname).toEqual('/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items')
  });

  it(`Final url should be 'https://deliver.kenticocloud.com/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items'`, () => {
    expect(itemsUrl).toEqual('https://deliver.kenticocloud.com/b52fa0db-84ec-4310-8f7c-3b94ed06644d/items')
  });
  
});

