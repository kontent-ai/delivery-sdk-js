import { packageId, repoHost, version } from '../../../lib/library-version';
import { Context, setup } from '../../setup';

describe('Core headers', () => {

    const context = new Context();

    setup(context);

    it(`SDK Id version header should be set`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const header = headers.find(m => m.header === 'X-KC-SDKID');
        expect(header).toBeDefined();
    });

    it(`Verifies SDK Id version format`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const header = headers.find(m => m.header === 'X-KC-SDKID');
        const expectedValue = `${repoHost};${packageId};${version}`;
        expect(header.value).toEqual(expectedValue);
    });

});

