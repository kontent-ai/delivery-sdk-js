const assert = require('assert');
const KenticoCloud = require('../../_commonjs');

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
});

describe('#View taxonomy group', () => {

    let result;

    before((done) => {
        deliveryClient.taxonomy('personas')
            .toObservable()
            .subscribe(response => {
                result = response;
                done();
            });
    });

    it('Response should be of proper type', () => {
        assert.ok(result);
        assert.ok((result instanceof KenticoCloud.TaxonomyResponses.TaxonomyResponse));
    });

    it('Response item should be of proper type', () => {
        assert.ok(result.taxonomy instanceof KenticoCloud.TaxonomyGroup);
    });

});

