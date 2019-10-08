const assert = require('assert');
const KontentDelivery = require('../../_commonjs');

class Article extends KontentDelivery.ContentItem {
    constructor() {
        super();
    }
}

const deliveryClient = new KontentDelivery.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
    typeResolvers: [
        new KontentDelivery.TypeResolver('article', () => new Article())
    ]
});

describe('#View content item', () => {

    let result;

    before((done) => {
        deliveryClient.item('on_roasts')
            .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
            .depthParameter(1)
            .toObservable()
            .subscribe(response => {
                result = response;
                done();
            });
    });

    it('Response should be of proper type', () => {
        assert.ok(result);
        assert.ok((result instanceof KontentDelivery.ItemResponses.ViewContentItemResponse));
    });

    it('Response items should be of proper type', () => {
        assert.ok(result.item instanceof KontentDelivery.ContentItem);
    });

});

