import { Context, setup } from '../../setup';

describe('Query custom parameter', () => {

  const context = new Context();
  setup(context);

  it(`Url should contain the custom parameter with value #1`, () => {
    const url = context.deliveryClient.items().withParameter('customParam', 'customVal').getUrl();
    expect(url).toContain(`customParam=customVal`);
  });

  it(`Url should contain the custom parameter with value #2`, () => {
    const url = context.deliveryClient.element('el', 'cd').withParameter('customParam', 'customVal').getUrl();
    expect(url).toContain(`customParam=customVal`);
  });

  it(`Custom param with invalid name should throw Error`, () => {
    expect(() => context.deliveryClient.items().withParameter(undefined as any, 'customVal')).toThrowError();
    expect(() => context.deliveryClient.items().withParameter(null as any, 'customVal')).toThrowError();
  });

});

