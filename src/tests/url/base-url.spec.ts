// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// real delivery client
import { realDeliveryClient, realDeliveryClientConfig } from '../delivery-clients/real-delivery-client';

// delivery client
import { DeliveryClient, DeliveryClientConfig } from '../../../lib';

// tests
describe('Base URL', () => {

  var itemsUrl: string;
  var parsedUrl: URL;
  var deliveryClientConfig: DeliveryClientConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DeliveryClient, useValue: realDeliveryClient,
        },
        {
          provide: DeliveryClientConfig, useValue: realDeliveryClientConfig,
        }
      ]
    });

    deliveryClientConfig = TestBed.get(DeliveryClientConfig) as DeliveryClientConfig;

    let deliveryClient = TestBed.get(DeliveryClient) as DeliveryClient;
    itemsUrl = deliveryClient.items().toString();

    parsedUrl = new URL(itemsUrl);
  });

  it(`url should be defined`, () => expect(itemsUrl).toBeDefined());

  it(`protocol should be 'https:'`, () => expect(parsedUrl.protocol).toEqual('https:'));

  it(`host should be 'deliver.kenticocloud.com'`, () => expect(parsedUrl.host).toEqual('deliver.kenticocloud.com'));

  it(`origin should be 'https://deliver.kenticocloud.com'`, () => expect(parsedUrl.origin).toEqual('https://deliver.kenticocloud.com'));

  it(`pathname should contain project id'`, () => expect(itemsUrl).toContain(deliveryClientConfig.projectId));

});

