const KontentDelivery = require('../../../dist/cjs');
const assert = require('assert');
const projectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

const deliveryClient = new KontentDelivery.DeliveryClient({
  projectId: projectId,
});

describe('Base node.js test', () => {

  let response;

  before(async () => {
    response = await deliveryClient.items()
      .type('movie')
      .limitParameter(10)
      .toPromise();
  });

  it('Response should be successful and should contain an item of defined type', () => {
    var item = response.data.items[0];

    assert.ok(item);
    assert.ok(item.system.codename);
  });
});




