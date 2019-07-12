const assert = require('assert');
const KenticoCloud = require('../../_commonjs');

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
    typeResolvers: []
});

const contentTypeHeaderName = 'Content-Type';

describe('#Headers', () => {

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

    it('Request headers should not contain ' + contentTypeHeaderName, () => {
        const requestHeaders = result.debug.response.config.headers;

        const contentTypeHeader = requestHeaders[contentTypeHeaderName];
        assert.equal(contentTypeHeader, undefined);
    });
    
});


