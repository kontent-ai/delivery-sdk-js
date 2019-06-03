import { IHeader } from 'kentico-cloud-core';

import { IQueryConfig } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Global headers', () => {
    let headers: IHeader[] = [];
    const context = new Context();
    let queryConfig: IQueryConfig | undefined;
    context.globalHeaders = (xQueryConfig) => {
        queryConfig = xQueryConfig;
        return [
            {
                header: 'gl1',
                value: 'vl1',
            },
            {
                header: 'gl2',
                value: 'vl2',
            }
        ];
    };

    setup(context);

    beforeAll((done) => {
        headers = context.deliveryClient.items().queryConfig({
            usePreviewMode: true
        }).getHeaders();

        done();
    });

    it(`Global headers should be set`, () => {
        const header1 = headers.find(m => m.header === 'gl1') as IHeader;
        const header2 = headers.find(m => m.header === 'gl2') as IHeader;
        expect(header1).toBeDefined();
        expect(header2).toBeDefined();

        expect(header1.value).toEqual('vl1');
        expect(header2.value).toEqual('vl2');
    });


    it(`Query config should be set and preview mode enabled`, () => {
        expect(queryConfig).toBeDefined();

        if (queryConfig) {
            expect(queryConfig.usePreviewMode).toBeTruthy();

        }
    });

});

