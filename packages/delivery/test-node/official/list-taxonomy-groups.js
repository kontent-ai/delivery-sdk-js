const assert = require('assert');
const KenticoCloud = require('../../_commonjs/lib');

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
});


describe('#List taxonomy groups', () => {

    let result;

    before((done) => {
        deliveryClient.taxonomies()
            .limitParameter(3)
            .getObservable()
            .subscribe(response => {
                result = response;
                done();
            });
    });

    it('Response should be of proper type', () => {
        assert.ok(result);
        assert.ok((result instanceof KenticoCloud.TaxonomyResponses.TaxonomiesResponse));
    });

    it('Response items should be of proper type', () => {
        assert.ok(result.taxonomies[0] instanceof KenticoCloud.TaxonomyGroup);
    });

});

