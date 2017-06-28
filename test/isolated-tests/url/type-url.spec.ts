// url parser
import urlParser from 'url-parse';

// setup
import { Context, setup } from '../../setup';

// tests
describe('Type URL', () => {

    var context = new Context();
    setup(context);

    it(`type query should thrown error when types's codename is not set`, () => {
        expect(() => context.deliveryClient.type(null)).toThrowError();
    });

     it(`type URL with 'movie' codename should contain '/types/movie`, () => {
        var url = context.deliveryClient.type('movie').toString();
        expect(url).toContain(`/types/movie`);
    });

    it(`type URL for all types should end with 'types'`, () => {
        var url = context.deliveryClient.types().toString();
        expect(url).toContain(`/types`);
    });

});

