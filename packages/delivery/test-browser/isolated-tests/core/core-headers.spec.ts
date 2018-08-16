import { sdkInfo } from '../../../lib';
import { Context, setup } from '../../setup';
import { IHeader } from 'kentico-cloud-core';

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
        const header = headers.find(m => m.header === 'X-KC-SDKID') as IHeader;
        const expectedValue = `${sdkInfo.host};${sdkInfo.name};${sdkInfo.version}`;
        expect(header.value).toEqual(expectedValue);
    });

});

