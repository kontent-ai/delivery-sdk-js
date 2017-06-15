// delivery client
import { DeliveryClient, DeliveryClientConfig } from '../../../lib';

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

