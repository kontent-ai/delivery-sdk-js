import { Context, setup } from '../../setup';

describe('Wait for loading new content', () => {

  const context = new Context();
  setup(context);

  const waitForLoadingNewContentHeader: string = 'X-KC-Wait-For-Loading-New-Content';

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
    expect(typeHeader).toBeUndefined();
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
    expect(typeHeader).toBeDefined();
    expect(typesHeader).toBeDefined();
  });
});


