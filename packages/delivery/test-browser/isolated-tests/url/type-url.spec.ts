import { Context, setup } from '../../setup';

describe('Type url', () => {

    const context = new Context();
    setup(context);

    it(`type query should thrown error when types's codename is not set`, () => {
        expect(() => context.deliveryClient.type(null as any)).toThrowError();
    });

    it(`type url with 'movie' codename should contain '/types/movie`, () => {
        const url = context.deliveryClient.type('movie').getUrl();
        expect(url).toContain(`/types/movie`);
    });

    it(`type url for all types should end with 'types'`, () => {
        const url = context.deliveryClient.types().getUrl();
        expect(url).toContain(`/types`);
    });

    it(`type url should contain skip parameter`, () => {
        const skip: number = 549228429;
        const url = context.deliveryClient.types().skipParameter(skip).getUrl();
        expect(url).toContain('skip=' + skip.toString());
    });

});

