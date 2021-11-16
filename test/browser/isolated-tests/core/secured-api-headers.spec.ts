import { Context, setup } from '../../setup';
import { IHeader } from '@kentico/kontent-core';

describe('Secured headers', () => {

    const context = new Context({
        defaultQueryConfig: {
            useSecuredMode: true
        }
    });

    setup(context);

    it(`secured authorization header should be defined when getting items (global config)'`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined();
    });

    it(`secured authorization header should be defined when getting taxonomies (global config)'`, () => {
        const headers = context.deliveryClient.types().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined();
    });

    it(`secured authorization header should be defined for getting types (global config)'`, () => {
        const headers = context.deliveryClient.taxonomies().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined();
    });

    it(`secured authorization header should contain secured API key (global config)'`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization') as IHeader;
        const expectedValue = 'bearer ' + context.securedApiKey;
        expect(authorizationHeader.value).toEqual(expectedValue);
    });

    it(`secured authorization header should NOT be defined when QueryConfig specifically disables it'`, () => {
        const headers = context.deliveryClient.items().queryConfig({
            useSecuredMode: false
        }).getHeaders();

        const authorizationHeader = headers.find(m => m.header === 'authorization');

        expect(authorizationHeader).toBeUndefined();
    });
});

