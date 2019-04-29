import { ItemResponses, Fields } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Test bug', () => {

  const context = new Context({
    projectId: 'ad858591-7c5b-00e9-52c1-796f3aebc535',
    usePreviewMode: true,
    // tslint:disable-next-line:max-line-length
    previewApiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNmZiMzU5ZGQzZDU0MzljOWVkOGNkNWNkOTFlZjRkMyIsImlhdCI6IjE1NTYxMDI5NjAiLCJleHAiOiIxOTAxNzAyOTYwIiwicHJvamVjdF9pZCI6ImFkODU4NTkxN2M1YjAwZTk1MmMxNzk2ZjNhZWJjNTM1IiwidmVyIjoiMS4wLjAiLCJhdWQiOiJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSJ9.14SMjIPcuHEQzzCqvDdzqDN_3slAc5twe6cG8sMwcXU'
  });
  setup(context);

  const type: string = 'scenario';
  let response: ItemResponses.DeliveryItemListingResponse<any>;

  beforeAll((done) => {
    context.deliveryClient.items<any>()
      .depthParameter(2)
      .equalsFilter('elements.url', 'test-my-content')
      .type(type)
      .toObservable()
      .subscribe(r => {
        console.log('RESOLVED');
        response = r as ItemResponses.DeliveryItemListingResponse<any>;
        done();
      });
  });

  it(`items should be defined`, () => {
    console.log('test: ', response);
    for (const item of response.items) {
      const introduction = (item.introduction as Fields.RichTextField).getHtml();
      const notes = (item.notes as Fields.RichTextField).getHtml();
    }
    expect(response).toBeDefined();
  });

});

