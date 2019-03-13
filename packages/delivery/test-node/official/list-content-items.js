const assert = require('assert');
const KenticoCloud = require('../../_commonjs');

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

describe('#List content items', () => {

    let result;

    before((done) => {
        deliveryClient.items()
            .equalsFilter('system.type', 'article')
            .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
            .orderParameter('elements.post_date', KenticoCloud.SortOrder.desc)
            .limitParameter(3)
            .toObservable()
            .subscribe(response => {
                result = response;
                done();
            });
    });

    it('Response should be of proper type', () => {
        assert.ok(result);
        assert.ok((result instanceof KenticoCloud.ItemResponses.DeliveryItemListingResponse));
    });

    it('Response should have > 0 && < 4 items', () => {
        assert.equal(result.items.length > 0 && result.items.length < 4, true);
    });

    it('Item should have system assigned', () => {
        assert.ok(result.items[0].system);
        assert.ok(result.items[0].system.codename);
    });

    it('Item should be of proper item type', () => {
        assert.ok(result.items[0].system.type === 'article');
        assert.ok(result.items[0].system.type !== 'movie');
    });
});


