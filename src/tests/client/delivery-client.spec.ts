// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// real delivery client
import { realDeliveryClient } from '../setup/real-delivery-client';

// delivery client
import { DeliveryClient, DeliveryClientConfig, TypeResolver } from '../../../lib';

// tests
describe('Delivery Client initialization', () => {

  it(`initialization DeliveryClient without config should throw error`, () => {
    expect(() => new DeliveryClient(null)).toThrowError();
  });

   it(`initialization DeliveryClientConfig without project should throw error`, () => {
    expect(() => new DeliveryClientConfig(null, [], null)).toThrowError();
  });

   it(`initialization DeliveryClientConfig without type resolvers should throw error`, () => {
    expect(() => new DeliveryClientConfig('projectId', null, null)).toThrowError();
  });

});

