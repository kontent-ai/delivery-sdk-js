import { DeliveryClient } from '../../lib';

describe('Delivery Client initialization', () => {
  it(`initialization DeliveryClient without config should throw error`, () => {
    expect(() => new DeliveryClient(null)).toThrowError();
    expect(() => new DeliveryClient(undefined)).toThrowError();
  });

});

