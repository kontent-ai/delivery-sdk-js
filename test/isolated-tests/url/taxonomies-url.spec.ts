// url parser
import urlParser from 'url-parse';

// setup
import { Context, setup } from '../../setup';

// tests
describe('Taxonomy url', () => {

    var context = new Context();
    setup(context);
   
    it(`taxonomies url should contain skip parameter`, () => {
        var skip: number = 549228429;
        var url = context.deliveryClient.taxonomies().skipParameter(skip).toString();
        expect(url).toContain('skip=' + skip.toString());
    });
});

