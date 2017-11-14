// url parser
import urlParser from 'url-parse';

// rxjs
import { AjaxResponse } from 'rxjs/Rx'

// setup
import { setup, Context, observableFactory, AllTestObjects } from '../../setup';

// tests
describe('Wait for loading new content', () => {

  const context = new Context();
  setup(context);

  const waitForLoadingNewContentHeader: string = 'X-KC-Wait-For-Loading-New-Content';

  let all: AllTestObjects;

  beforeAll((done) => {
    observableFactory.getAllTestObjects(context.deliveryClient, { waitForLoadingNewContent: true })
      .subscribe((reponse: AllTestObjects) => {
        all = reponse;
        done();
      });
  })

  it(`'X-KC-Wait-For-Loading-New-Content' header should NOT be set when Query configuration does not set it`, () => {
    const itemHeaders = context.deliveryClient.item('any').getHeaders();
    const itemsHeaders = context.deliveryClient.items().getHeaders();
    const taxonomyHeaders = context.deliveryClient.taxonomy('any').getHeaders();
    const taxonomiesHeaders = context.deliveryClient.taxonomies().getHeaders();
    const typeHeaders = context.deliveryClient.type('any').getHeaders();
    const typesHeaders = context.deliveryClient.types().getHeaders();

    const itemHeader = itemHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const itemsHeader = itemsHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const taxonomyHeader = taxonomyHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const taxonomiesHeader = taxonomiesHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const typeHeader = typeHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const typesHeader = typesHeaders.find(m => m.header === waitForLoadingNewContentHeader);

    expect(itemHeader).toBeUndefined();
    expect(itemsHeader).toBeUndefined();
    expect(taxonomyHeader).toBeUndefined();
    expect(taxonomiesHeader).toBeUndefined();
    expect(typesHeader).toBeUndefined();
    expect(typesHeader).toBeUndefined();
  });

  it(`'X-KC-Wait-For-Loading-New-Content' header should be be set when Query configuration enables it`, () => {
    const itemHeaders = context.deliveryClient.item('any').queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    const itemsHeaders = context.deliveryClient.items().queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    const taxonomyHeaders = context.deliveryClient.taxonomy('any').queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    const taxonomiesHeaders = context.deliveryClient.taxonomies().queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    const typeHeaders = context.deliveryClient.type('any').queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    const typesHeaders = context.deliveryClient.types().queryConfig({ waitForLoadingNewContent: true }).getHeaders();

    const itemHeader = itemHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const itemsHeader = itemsHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const taxonomyHeader = taxonomyHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const taxonomiesHeader = taxonomiesHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const typeHeader = typeHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    const typesHeader = typesHeaders.find(m => m.header === waitForLoadingNewContentHeader);

    expect(itemHeader).toBeDefined();
    expect(itemsHeader).toBeDefined();
    expect(taxonomyHeader).toBeDefined();
    expect(taxonomiesHeader).toBeDefined();
    expect(typesHeader).toBeDefined();
    expect(typesHeader).toBeDefined();
  });

  it(`Verifies that 'X-KC-Wait-For-Loading-New-Content' header is actually present in request`, () => {
    if (all.item.debug.response instanceof AjaxResponse) {
      const header = all.item.debug.response.request.headers[waitForLoadingNewContentHeader];
      expect(header).toEqual('true');
    }
    if (all.items.debug.response instanceof AjaxResponse) {
      const header = all.items.debug.response.request.headers[waitForLoadingNewContentHeader];
      expect(header).toEqual('true');
    }
    if (all.taxonomy.debug.response instanceof AjaxResponse) {
      const header = all.taxonomy.debug.response.request.headers[waitForLoadingNewContentHeader];
      expect(header).toEqual('true');
    }
    if (all.taxonomies.debug.response instanceof AjaxResponse) {
      const header = all.taxonomies.debug.response.request.headers[waitForLoadingNewContentHeader];
      expect(header).toEqual('true');
    }
    if (all.type.debug.response instanceof AjaxResponse) {
      const header = all.type.debug.response.request.headers[waitForLoadingNewContentHeader];
      expect(header).toEqual('true');
    }
    if (all.types.debug.response instanceof AjaxResponse) {
      const header = all.types.debug.response.request.headers[waitForLoadingNewContentHeader];
      expect(header).toEqual('true');
    }
  });
})


