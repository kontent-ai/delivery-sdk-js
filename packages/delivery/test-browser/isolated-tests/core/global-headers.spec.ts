import { IHeader } from 'kentico-cloud-core';

import { Context, setup } from '../../setup';

describe('Global headers', () => {

    const context = new Context();

    context.globalHeaders = [{
        header: 'gl1',
        value: 'vl1',
    },
    {
        header: 'gl2',
        value: 'vl2',
    }];

    setup(context);

    console.warn('CONTEXt', context);

    it(`Global headers should be set`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const header1 = headers.find(m => m.header === 'gl1') as IHeader;
        const header2 = headers.find(m => m.header === 'gl2') as IHeader;
        expect(header1).toBeDefined();
        expect(header2).toBeDefined();

        expect(header1.value).toEqual('vl1');
        expect(header2.value).toEqual('vl2');
    });

});

