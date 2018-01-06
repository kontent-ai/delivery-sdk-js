// url parser
import urlParser from 'url-parse';

// setup
import { setup, Context } from '../../setup';

import { IHeader } from '../../../lib/interfaces/common/iheader.interface'

import { version, packageId, repoHost } from '../../../lib/library-version';

// tests
describe('Core headers', () => {

    const context = new Context({
        usePreviewMode: true
    });

    setup(context);

    it(`preview authorization header should be defined when getting items (global config)'`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined()
    });

    it(`preview authorization header should be defined when getting taxonomies (global config)'`, () => {
        const headers = context.deliveryClient.types().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined()
    });

    it(`preview authorization header should be defined for getting types (global config)'`, () => {
        const headers = context.deliveryClient.taxonomies().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined()
    });

    it(`preview authorization header should contain preview API key (global config)'`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const authorizationHeader = headers.find(m => m.header === 'authorization');
        const expectedValue = 'bearer ' + context.previewApiKey;
        expect(authorizationHeader.value).toEqual(expectedValue)
    });

    it(`preview authorization header should NOT be defined when QueryConfig specifically disables it'`, () => {
        const headers = context.deliveryClient.items().queryConfig({
            usePreviewMode: false
        }).getHeaders();

        const authorizationHeader = headers.find(m => m.header === 'authorization');

        expect(authorizationHeader).toBeUndefined()
    });

    it(`SDK Id version header should be set`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const header = headers.find(m => m.header === 'X-KC-SDKID');
        expect(header).toBeDefined()
    });

    it(`Verifies SDK Id version format`, () => {
        const headers = context.deliveryClient.items().getHeaders();
        const header = headers.find(m => m.header === 'X-KC-SDKID');
        const expectedValue = `${repoHost};${packageId};${version}`
        expect(header.value).toEqual(expectedValue);
    });

});

