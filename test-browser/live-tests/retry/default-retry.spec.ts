import { DeliveryClient } from '../../../lib';

const expectedRetryAttempts = 3;

describe('Default retry config', () => {

  it(`Retry attempts should be enabled by default and set to '${expectedRetryAttempts}'`, () => {
    const client = new DeliveryClient({
      projectId: 'xxx'
    });

    expect(client['queryService']['getRetryAttempts']()).toEqual(expectedRetryAttempts);
  });
});

