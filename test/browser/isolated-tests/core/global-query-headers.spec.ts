import { Context, setup } from '../../setup';

describe('Global query headers', () => {

    it(`globally defined header should stay in headers when query config defines empty header array`, () => {
        const context = new Context({
            globalHeaders: (config) => [
                {
                    header: 'xHeader',
                    value: 'x'
                }
            ],
            defaultQueryConfig: {
                customHeaders: []
            }
        });

        setup(context);
        const headers = context.deliveryClient.items().getHeaders();
        const xHeader = headers.find(m => m.header === 'xHeader');
        expect(xHeader).toBeDefined();
    });

    it(`globally defined header should stay in headers along with headers defined by query config`, () => {
        const context = new Context({
            globalHeaders: (config) => [
                {
                    header: 'xHeader',
                    value: 'x'
                }
            ],
            defaultQueryConfig: {
                customHeaders: [{
                    header: 'yHeader',
                    value: 'y'
                }]
            }
        });

        setup(context);
        const headers = context.deliveryClient.items().getHeaders();
        const xHeader = headers.find(m => m.header === 'xHeader');
        const yHeader = headers.find(m => m.header === 'yHeader');
        expect(xHeader).toBeDefined();
        expect(yHeader).toBeDefined();
    });

});

