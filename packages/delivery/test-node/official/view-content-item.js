const assert = require('assert');
const KenticoCloud = require('../../_commonjs/lib');

class Article extends KenticoCloud.ContentItem {
    constructor() {
        super();
    }
}

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
    typeResolvers: [
        new KenticoCloud.TypeResolver('article', () => new Article())
    ]
});

describe('#View content item', () => {

    let result;

    before((done) => {
        deliveryClient.item('on_roasts')
            .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
            .depthParameter(1)
            .getObservable()
            .subscribe(response => {
                result = response;
                done();
            });
    });

    it('Response should be of proper type', () => {
        assert.ok(result);
        assert.ok((result instanceof KenticoCloud.ItemResponses.DeliveryItemResponse));
    });

    it('Response items should be of proper type', () => {
        assert.ok(result.item instanceof KenticoCloud.ContentItem);
    });

});

