// url parser
import urlParser from 'url-parse';

// setup
import { Context, setup } from '../../setup';

// tests
describe('Item URL', () => {

    const context = new Context();
    setup(context);

    it(`item query should thrown error when item's codename is not set`, () => {
        expect(() => context.deliveryClient.item(null)).toThrowError();
    });

    it(`item query should thrown error when item's codename is empty`, () => {
        expect(() => context.deliveryClient.item('')).toThrowError();
    });

    it(`item url with 'kyle' codename should end with '/items/kyle`, () => {
        const url = new URL(context.deliveryClient.item('kyle').toString());
        expect(url.toString()).toContain(`/items/kyle`);
    });

    it(`item url with 'arnold' codename should end with '/items/arnold'`, () => {
        const url = new URL(context.deliveryClient.item('arnold').toString());
        expect(url.toString()).toContain(`/items/arnold`);
    });
});

