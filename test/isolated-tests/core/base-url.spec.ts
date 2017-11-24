// url parser
import urlParser from 'url-parse';

// setup
import { setup, Context } from '../../setup';

// tests
describe('Base URL', () => {

  const context = new Context();
  setup(context);

  let itemsUrl: string;
  let parsedUrl: URL;

  beforeAll(() => {
    itemsUrl = context.deliveryClient.items().toString();

    parsedUrl = new URL(itemsUrl);
  });

  it(`url should be defined`, () => expect(itemsUrl).toBeDefined());

  it(`protocol should be 'https:'`, () => expect(parsedUrl.protocol).toEqual('https:'));

  it(`host should be 'deliver.kenticocloud.com'`, () => expect(parsedUrl.host).toEqual('deliver.kenticocloud.com'));

  it(`origin should be 'https://deliver.kenticocloud.com'`, () => expect(parsedUrl.origin).toEqual('https://deliver.kenticocloud.com'));

  it(`pathname should contain project id'`, () => expect(itemsUrl).toContain(context.projectId));

  it(`custom base URL should be used'`, () => {
    const baseUrl = 'http://custombase.com';
    const contextCustom = new Context({baseUrl: baseUrl});
    setup(contextCustom);
    expect(contextCustom.deliveryClient.items().toString()).toContain(baseUrl);
  });

  it(`custom preview URL should be used'`, () => {
    const previewUrl = 'http://custompreview.com';
    const contextCustom = new Context({basePreviewUrl: previewUrl, usePreviewMode: true});
    setup(contextCustom);
    expect(contextCustom.deliveryClient.items().toString()).toContain(previewUrl);
  });

});

