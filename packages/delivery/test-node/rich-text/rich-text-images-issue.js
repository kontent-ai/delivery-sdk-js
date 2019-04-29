const assert = require('assert');
const KenticoCloud = require('../../_commonjs');

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'ad858591-7c5b-00e9-52c1-796f3aebc535',
    previewApiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNmZiMzU5ZGQzZDU0MzljOWVkOGNkNWNkOTFlZjRkMyIsImlhdCI6IjE1NTYxMDI5NjAiLCJleHAiOiIxOTAxNzAyOTYwIiwicHJvamVjdF9pZCI6ImFkODU4NTkxN2M1YjAwZTk1MmMxNzk2ZjNhZWJjNTM1IiwidmVyIjoiMS4wLjAiLCJhdWQiOiJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSJ9.14SMjIPcuHEQzzCqvDdzqDN_3slAc5twe6cG8sMwcXU',
    enablePreviewMode: true,
    typeResolvers: [],
});

describe('#Rich text images issue', () => {

  let response;

    before((done) => {
        deliveryClient.items()
        .depthParameter(2)
        .equalsFilter('elements.url', 'test-my-content')
        .type('scenario')
        .toObservable()
            .subscribe(r => {
                response = r;
                done();
            });
    });
 
    it('Test included images', () => {
      const codenames = Object.keys(response.linkedItems);

      for (const codename of codenames) {
        const item = response.linkedItems[codename];
        if (item.system.type === 'callout') {
          // resolve html
          console.log('Resolving item with codename: ' + item.system.codename);
          const contentHtml = item.content.getHtml();
          console.log(contentHtml);
          console.log('\n\n\n');
        }
        assert.ok(codename);
      } 

    });
});
