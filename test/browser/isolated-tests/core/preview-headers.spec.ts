import { Context, setup } from '../../setup';
import { IHeader } from '@kentico/kontent-core';

describe('Preview headers', () => {

    const context = new Context({
        defaultQueryConfig: {
            usePreviewMode: true
        }
    });

    setup(context);

    it(`preview authorization header should be defined when getting items (global config)'`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined();
    });

    it(`preview authorization header should be defined when getting taxonomies (global config)'`, () => {
        const headers = context.deliveryClient.types().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined();
    });

    it(`preview authorization header should be defined for getting types (global config)'`, () => {
        const headers = context.deliveryClient.taxonomies().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined();
    });

    it(`preview authorization header should contain preview API key (global config)'`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization') as IHeader;
        const expectedValue = 'bearer ' + context.previewApiKey;
        expect(authorizationHeader.value).toEqual(expectedValue);
    });

    it(`preview authorization header should NOT be defined when QueryConfig specifically disables it'`, () => {
        const headers = context.deliveryClient.items().queryConfig({
            usePreviewMode: false
        }).getHeaders();

        const authorizationHeader = headers.find(m => m.header === 'authorization');

        expect(authorizationHeader).toBeUndefined();
    });
});

