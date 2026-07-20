import { Context, setup } from '../../setup';

describe('Item URL', () => {

    const context = new Context();
    setup(context);

    it(`item query should thrown error when item's codename is not set`, () => {
        expect(() => context.deliveryClient.item(null as any)).toThrowError();
    });

    it(`item query should thrown error when item's codename is empty`, () => {
        expect(() => context.deliveryClient.item('')).toThrowError();
    });

    it(`item url with 'kyle' codename should end with '/items/kyle`, () => {
        const url = new URL(context.deliveryClient.item('kyle').getUrl());
        expect(url.toString()).toContain(`/items/kyle`);
    });

    it(`item url with 'arnold' codename should end with '/items/arnold'`, () => {
        const url = new URL(context.deliveryClient.item('arnold').getUrl());
        expect(url.toString()).toContain(`/items/arnold`);
    });

    it(`item url should encode path traversal in codename and not redirect the endpoint`, () => {
        const url = context.deliveryClient.item('../types').getUrl();
        expect(url).toContain(`/items/..%2Ftypes`);
        expect(url).not.toContain(`/items/../types`);
    });

    it(`item url should encode query-injection characters in codename`, () => {
        const url = context.deliveryClient.item('a?x=1&y=2#z').getUrl();
        expect(url).toContain(`/items/a%3Fx%3D1%26y%3D2%23z`);
        expect(url).not.toContain(`/items/a?x=1&y=2`);
    });
});

