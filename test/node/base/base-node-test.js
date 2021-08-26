const http = require('http');
const https = require('https');
const Rx = require('rxjs');
const KontentDelivery = require('../../../dist/cjs');
const assert = require('assert');
const projectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

class Movie extends KontentDelivery.ContentItem {

}

class Actor extends KontentDelivery.ContentItem {

}

const deliveryClient = new KontentDelivery.DeliveryClient({
  projectId: projectId,
  typeResolvers: [
    new KontentDelivery.TypeResolver('movie', () => new Movie()),
    new KontentDelivery.TypeResolver('actor', () => new Actor())
  ]
});

describe('Base node.js test', () => {
  describe('#items', () => {
    it('Response should be successful and should contain an item of defined type', (done) => {
      deliveryClient.items()
        .type('movie')
        .limitParameter(10)
        .toObservable()
        .subscribe(response => {

          var item = response.items[0];

          assert.ok(item);

          assert.ok(item.system.codename);

          assert.ok((item instanceof Movie));

          assert.equal(item instanceof Actor, false)

          done();
        }, );
    });
  });
});




