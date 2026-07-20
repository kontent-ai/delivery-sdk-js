import { Context, setup } from '../../setup';

describe('Element url', () => {
    const context = new Context();
    setup(context);

    it(`element url with 'movie' type and 'title' element should contain '/types/movie/elements/title'`, () => {
        const url = context.deliveryClient.element('movie', 'title').getUrl();
        expect(url).toContain(`/types/movie/elements/title`);
    });

    it(`element url should encode path traversal in both type and element codenames`, () => {
        const url = context.deliveryClient.element('../items', '../title').getUrl();
        expect(url).toContain(`/types/..%2Fitems/elements/..%2Ftitle`);
        expect(url).not.toContain(`/types/../items`);
        expect(url).not.toContain(`/elements/../title`);
    });
});
