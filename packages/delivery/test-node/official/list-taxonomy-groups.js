const assert = require('assert');
const KontentDelivery = require('../../_commonjs');

const deliveryClient = new KontentDelivery.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
});


describe('#List taxonomy groups', () => {

    let result;

    before((done) => {
        deliveryClient.taxonomies()
            .limitParameter(3)
            .toObservable()
            .subscribe(response => {
                result = response;
                done();
            });
    });

    it('Response should be of proper type', () => {
        assert.ok(result);
        assert.ok((result instanceof KontentDelivery.TaxonomyResponses.ListTaxonomyGroupsResponse));
    });

    it('Response items should be of proper type', () => {
        assert.ok(result.taxonomies[0] instanceof KontentDelivery.TaxonomyGroup);
    });

});

