const http = require('http');
const https = require('https');
const Rx = require('rxjs');
const KenticoCloud = require('_commonjs');
const assert = require('assert');
const projectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

class Movie extends KenticoCloud.ContentItem {

}

class Actor extends KenticoCloud.ContentItem {

}

const deliveryClient = new KenticoCloud.DeliveryClient({
  projectId: projectId,
  typeResolvers: [
    new KenticoCloud.TypeResolver('movie', () => new Movie()),
    new KenticoCloud.TypeResolver('actor', () => new Actor())
  ]
});

describe('Base node.js test', () => {
  describe('#items', () => {
    it('Response should be successful and should contain an item of defined type', (done) => {
      deliveryClient.items()
        .type('movie')
        .limitParameter(10)
        .getObservable()
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




