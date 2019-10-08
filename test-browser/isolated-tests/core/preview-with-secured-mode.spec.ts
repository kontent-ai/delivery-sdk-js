import { Context, setup } from '../../setup';

describe('Using secured with preview mode', () => {

    const context = new Context({
        globalQueryConfig: {
            usePreviewMode: true,
            useSecuredMode: true
        }
    });

    setup(context);

    it(`using secured API in combination with preview mode should thrown an Exception`, () => {
        expect(() => context.deliveryClient.items().getHeaders()).toThrowError();
    });
});

