// url parser
import urlParser from 'url-parse';

// setup
import { setup, Context } from '../../setup';

import { IHeader } from '../../../lib/interfaces/common/iheader.interface'

// tests
describe('Preview URL', () => {

    var context = new Context({
        usePreviewMode: true
    });

    setup(context);

    it(`origin should be 'https://preview-deliver.kenticocloud.com'`, () => {
        var url = new URL(context.deliveryClient.items().toString());
        expect(url.origin).toEqual('https://preview-deliver.kenticocloud.com')
    });

    it(`preview pathname should contain project id'`, () => {
        var url = context.deliveryClient.items().toString();
        expect(url).toContain(context.projectId)
    });

    it(`preview authorization header should be defined (global config)'`, () => {
        var headers = context.deliveryClient.items().getHeaders();
        var authorizationHeader = headers.find(m => m.header === 'authorization');
        expect(authorizationHeader).toBeDefined()
    });

    it(`preview authorization header should contain preview API key (global config)'`, () => {
        var headers = context.deliveryClient.items().getHeaders();
        var authorizationHeader = headers.find(m => m.header === 'authorization');
        var expectedValue = 'bearer ' + context.previewApiKey;
        expect(authorizationHeader.value).toEqual(expectedValue)
    });

    it(`preview authorization header should NOT be defined when QueryConfig specifically disables it'`, () => {
        var headers = context.deliveryClient.items().queryConfig({
            usePreviewMode: false
        }).getHeaders();

        var authorizationHeader = headers.find(m => m.header === 'authorization');

        expect(authorizationHeader).toBeUndefined()
    });
});

