// url parser
import urlParser from 'url-parse';

// setup
import { Context, setup } from '../../setup';

// tests
describe('Taxonomy url', () => {

    const context = new Context();
    setup(context);

    it(`taxonomies url should contain skip parameter`, () => {
        const skip: number = 549228429;
        const url = context.deliveryClient.taxonomies().skipParameter(skip).toString();
        expect(url).toContain('skip=' + skip.toString());
    });
});

