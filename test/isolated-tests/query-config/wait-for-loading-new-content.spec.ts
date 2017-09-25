// url parser
import urlParser from 'url-parse';

// setup
import { setup, Context, observableFactory, AllTestObjects } from '../../setup';

// tests
describe('Wait for loading new content', () => {

  var context = new Context();
  setup(context);

  var waitForLoadingNewContentHeader: string = 'X-KC-Wait-For-Loading-New-Content';

  var all: AllTestObjects;

  beforeAll((done) => {
    observableFactory.getAllTestObjects(context.deliveryClient, { waitForLoadingNewContent: true })
      .subscribe((reponse: AllTestObjects) => {
        all = reponse;
        done();
      });
  });

  it(`'X-KC-Wait-For-Loading-New-Content' header should NOT be set when Query configuration does not set it`, () => {
    var itemHeaders = context.deliveryClient.item('any').getHeaders();
    var itemsHeaders = context.deliveryClient.items().getHeaders();
    var taxonomyHeaders = context.deliveryClient.taxonomy('any').getHeaders();
    var taxonomiesHeaders = context.deliveryClient.taxonomies().getHeaders();
    var typeHeaders = context.deliveryClient.type('any').getHeaders();
    var typesHeaders = context.deliveryClient.types().getHeaders();

    var itemHeader = itemHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var itemsHeader = itemsHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var taxonomyHeader = taxonomyHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var taxonomiesHeader = taxonomiesHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var typeHeader = typeHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var typesHeader = typesHeaders.find(m => m.header === waitForLoadingNewContentHeader);

    expect(itemHeader).toBeUndefined();
    expect(itemsHeader).toBeUndefined();
    expect(taxonomyHeader).toBeUndefined();
    expect(taxonomiesHeader).toBeUndefined();
    expect(typesHeader).toBeUndefined();
    expect(typesHeader).toBeUndefined();
  });

  it(`'X-KC-Wait-For-Loading-New-Content' header should be be set when Query configuration enables it`, () => {
    var itemHeaders = context.deliveryClient.item('any').queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    var itemsHeaders = context.deliveryClient.items().queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    var taxonomyHeaders = context.deliveryClient.taxonomy('any').queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    var taxonomiesHeaders = context.deliveryClient.taxonomies().queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    var typeHeaders = context.deliveryClient.type('any').queryConfig({ waitForLoadingNewContent: true }).getHeaders();
    var typesHeaders = context.deliveryClient.types().queryConfig({ waitForLoadingNewContent: true }).getHeaders();

    var itemHeader = itemHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var itemsHeader = itemsHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var taxonomyHeader = taxonomyHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var taxonomiesHeader = taxonomiesHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var typeHeader = typeHeaders.find(m => m.header === waitForLoadingNewContentHeader);
    var typesHeader = typesHeaders.find(m => m.header === waitForLoadingNewContentHeader);

    expect(itemHeader).toBeDefined();
    expect(itemsHeader).toBeDefined();
    expect(taxonomyHeader).toBeDefined();
    expect(taxonomiesHeader).toBeDefined();
    expect(typesHeader).toBeDefined();
    expect(typesHeader).toBeDefined();
  });

  it(`Verifies that 'X-KC-Wait-For-Loading-New-Content' header is actually present in request`, () => {
    var itemHeader = all.item.debug.request.headers[waitForLoadingNewContentHeader];
    var itemsHeader = all.items.debug.request.headers[waitForLoadingNewContentHeader];
    var taxonomyHeader = all.taxonomy.debug.request.headers[waitForLoadingNewContentHeader];
    var taxonomiesHeader = all.taxonomies.debug.request.headers[waitForLoadingNewContentHeader];
    var typeHeader = all.type.debug.request.headers[waitForLoadingNewContentHeader];
    var typesHeader = all.types.debug.request.headers[waitForLoadingNewContentHeader];

    expect(itemHeader).toEqual('true');
    expect(itemsHeader).toEqual('true');
    expect(taxonomyHeader).toEqual('true');
    expect(taxonomiesHeader).toEqual('true');
    expect(typeHeader).toEqual('true');
    expect(typesHeader).toEqual('true');
  });

});

