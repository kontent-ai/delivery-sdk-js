// url parser
import urlParser from 'url-parse';

// setup
import { Context, setup } from '../../setup';

// tests
describe('Item URL', () => {

    var context = new Context();
    setup(context);

    it(`item query should thrown error when item's codename is not set`, () => {
        expect(() => context.deliveryClient.item(null)).toThrowError();
    });

    it(`item query should thrown error when item's codename is empty`, () => {
        expect(() => context.deliveryClient.item('')).toThrowError();
    });

    it(`item URL with 'kyle' codename should end with '/items/kyle`, () => {
        var url = new URL(context.deliveryClient.item('kyle').toString());
        var last11Digits = url.pathname.substr(url.pathname.length - 11);
        expect(last11Digits).toEqual(`/items/kyle`);
    });

    it(`item URL with 'arnold' codename should end with '/items/arnold'`, () => {
        var url = new URL(context.deliveryClient.item('arnold').toString());
        var last13Digits = url.pathname.substr(url.pathname.length - 13);
        expect(last13Digits).toEqual(`/items/arnold`);
    });
});

