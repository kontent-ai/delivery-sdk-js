import { DeliveryClient } from '../../lib';

describe('Delivery Client initialization', () => {
  it(`initialization DeliveryClient without config should throw error`, () => {
    expect(() => new DeliveryClient(null as any)).toThrowError();
    expect(() => new DeliveryClient(undefined as any)).toThrowError();
  });

});

