import { Context, setup } from '../../setup';

describe('Base URL', () => {

  const context = new Context();
  setup(context);

  let itemsUrl: string;
  let parsedUrl: URL;

  beforeAll(() => {
    itemsUrl = context.deliveryClient.items().getUrl();

    parsedUrl = new URL(itemsUrl);
  });

  it(`url should be defined`, () => expect(itemsUrl).toBeDefined());

  it(`protocol should be 'https:'`, () => expect(parsedUrl.protocol).toEqual('https:'));

  it(`host should be 'deliver.kontent.ai'`, () => expect(parsedUrl.host).toEqual('deliver.kontent.ai'));

  it(`origin should be 'https://deliver.kontent.ai'`, () => expect(parsedUrl.origin).toEqual('https://deliver.kontent.ai'));

  it(`pathname should contain environment id'`, () => expect(itemsUrl).toContain(context.environmentId));

  it(`custom base URL should be used'`, () => {
    const baseUrl = 'http://custombase.com';
    const contextCustom = new Context({baseUrl: baseUrl});
    setup(contextCustom);
    expect(contextCustom.deliveryClient.items().getUrl()).toContain(baseUrl);
  });

  it(`custom preview URL should be used'`, () => {
    const previewUrl = 'http://custompreview.com';
    const contextCustom = new Context({basePreviewUrl: previewUrl, defaultQueryConfig: { usePreviewMode: true}});
    setup(contextCustom);
    expect(contextCustom.deliveryClient.items().getUrl()).toContain(previewUrl);
  });

});

