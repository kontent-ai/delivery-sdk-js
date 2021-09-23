import { Context, setup } from '../../setup';

describe('Wait for loading new content header', () => {

    it(`defaultQueryConfig header should be present in headers`, () => {
        const context = new Context({
            defaultQueryConfig: {
                waitForLoadingNewContent: true
            }
        });

        setup(context);
        const headers = context.deliveryClient.items().getHeaders();
        const waitForLoadingNewContentHeader = headers.find(m => m.header === 'X-KC-Wait-For-Loading-New-Content');
        expect(waitForLoadingNewContentHeader).toBeDefined();
    });

    it(`defaultQueryConfig header should not be present in headers`, () => {
        const context = new Context({
            defaultQueryConfig: {
                waitForLoadingNewContent: false
            }
        });

        setup(context);
        const headers = context.deliveryClient.items().getHeaders();
        const waitForLoadingNewContentHeader = headers.find(m => m.header === 'X-KC-Wait-For-Loading-New-Content');
        expect(waitForLoadingNewContentHeader).toBeUndefined();
    });

    it(`defaultQueryConfig header should be present in headers`, () => {
        const context = new Context({
            defaultQueryConfig: {
                waitForLoadingNewContent: false
            }
        });

        setup(context);
        const headers = context.deliveryClient.items().queryConfig({ waitForLoadingNewContent: true }).getHeaders();
        const waitForLoadingNewContentHeader = headers.find(m => m.header === 'X-KC-Wait-For-Loading-New-Content');
        expect(waitForLoadingNewContentHeader).toBeDefined();
    });

    it(`defaultQueryConfig header should not be present in headers`, () => {
        const context = new Context({
            defaultQueryConfig: {
                waitForLoadingNewContent: true
            }
        });

        setup(context);
        const headers = context.deliveryClient.items().queryConfig({ waitForLoadingNewContent: false }).getHeaders();
        const waitForLoadingNewContentHeader = headers.find(m => m.header === 'X-KC-Wait-For-Loading-New-Content');
        expect(waitForLoadingNewContentHeader).toBeUndefined();
    });

});

