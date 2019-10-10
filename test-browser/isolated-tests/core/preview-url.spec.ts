import { Context, setup } from '../../setup';

describe('Preview URL', () => {

    const context = new Context({
        globalQueryConfig: {
            usePreviewMode: true
        }
    });

    setup(context);

    it(`origin should be 'https://preview-deliver.kontent.ai'`, () => {
        const url = new URL(context.deliveryClient.items().getUrl());
        expect(url.origin).toEqual('https://preview-deliver.kontent.ai');
    });

    it(`preview pathname should contain project id'`, () => {
        const url = context.deliveryClient.items().getUrl();
        expect(url).toContain(context.projectId);
    });
});

