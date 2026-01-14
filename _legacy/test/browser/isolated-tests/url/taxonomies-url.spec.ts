import { Context, setup } from '../../setup';

describe('Taxonomy url', () => {

    const context = new Context();
    setup(context);

    it(`taxonomies url should contain skip parameter`, () => {
        const skip: number = 549228429;
        const url = context.deliveryClient.taxonomies().skipParameter(skip).getUrl();
        expect(url).toContain('skip=' + skip.toString());
    });
});

