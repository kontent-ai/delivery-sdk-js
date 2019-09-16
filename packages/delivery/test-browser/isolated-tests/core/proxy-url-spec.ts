import { DeliveryClient, IProxyUrlData } from '../../../lib';

describe('Proxy URL #1', () => {

  let proxyData: IProxyUrlData | undefined;

  const client = new DeliveryClient({
    projectId: 'xxx',
    proxy: {
      advancedProxyUrlResolver: (data) => {
        proxyData = data;
        return 'http://custom-proxy.io';
      }
    }
  });

  const itemsUrl: string = client
    .item('xCodename')
    .depthParameter(1)
    .elementsParameter(['xElement'])
    .queryConfig({
      useSecuredMode: true
    })
    .getUrl();

  it(`Custom proxy should be applied as request URL`, () => expect(itemsUrl).toEqual('http://custom-proxy.io'));

  it(`Proxy data should be assigned correctly`, () => {
    if (!proxyData) {
      throw Error(`Proxy data is invalid`);
    }
    expect(proxyData.action).toEqual('/items/xCodename');
    expect(proxyData.queryParameters.length).toEqual(2);
    expect(proxyData.projectId).toEqual('xxx');
    expect(proxyData.queryString).toEqual('?depth=1&elements=xElement');
    expect(proxyData.queryConfig.useSecuredMode).toBeTruthy();
    expect(proxyData.domain).toEqual('https://deliver.kontent.ai');
  });
});


