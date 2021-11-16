import { Context, setup } from '../../setup';

describe('Custom query headers', () => {
  const context = new Context();
  setup(context);

  it(`Item query initialization with invalid codename should throw Error`, () => {
    expect(() => context.deliveryClient.item(null as any)).toThrowError();
  });

  it(`Header should be present in result`, () => {
    const headers = context.deliveryClient
      .items()
      .queryConfig({
        customHeaders: [
          {
            header: 'xHeader',
            value: 'yValue'
          }
        ]
      })
      .getHeaders();

    const itemHeader = headers.find(
      m => m.header === 'xHeader' && m.value === 'yValue'
    );

    expect(itemHeader).toBeDefined();
  });
});
