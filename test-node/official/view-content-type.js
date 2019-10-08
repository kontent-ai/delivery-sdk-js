const assert = require('assert');
const KontentDelivery = require('../../_commonjs');

const deliveryClient = new KontentDelivery.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
});

describe('#View content type', () => {

    let result;

    before((done) => {
        deliveryClient.type('coffee')
            .toObservable()
            .subscribe(response => {
                result = response;
                done();
            });
    });

    it('Response should be of proper type', () => {
        assert.ok(result);
        assert.ok((result instanceof KontentDelivery.TypeResponses.ViewContentTypeResponse));
    });

    it('Response items should be of proper type', () => {
        assert.ok(result.type instanceof KontentDelivery.ContentType);
    });

});

