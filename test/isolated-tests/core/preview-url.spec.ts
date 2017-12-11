// url parser
import urlParser from 'url-parse';

// setup
import { setup, Context } from '../../setup';

import { IHeader } from '../../../lib/interfaces/common/iheader.interface'

// tests
describe('Preview URL', () => {

    const context = new Context({
        usePreviewMode: true
    });

    setup(context);

    it(`origin should be 'https://preview-deliver.kenticocloud.com'`, () => {
        const url = new URL(context.deliveryClient.items().toString());
        expect(url.origin).toEqual('https://preview-deliver.kenticocloud.com')
    });

    it(`preview pathname should contain project id'`, () => {
        const url = context.deliveryClient.items().toString();
        expect(url).toContain(context.projectId)
    });

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
});

