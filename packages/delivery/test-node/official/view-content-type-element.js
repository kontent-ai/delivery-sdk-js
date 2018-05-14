const assert = require('assert');
const KenticoCloud = require('../../_commonjs');

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
});

describe('#View content type element', () => {

    let result;

    before((done) => {
        deliveryClient.element('coffee', 'processing')
            .getObservable()
            .subscribe(response => {
                result = response;
                done();
            });
    });

    it('Response should be of proper type', () => {
        assert.ok(result);
        assert.ok((result instanceof KenticoCloud.ElementResponses.ElementResponse));
    });

    it('Response item should be of proper type', () => {
        assert.ok(result.element instanceof KenticoCloud.Element);
    });

});

