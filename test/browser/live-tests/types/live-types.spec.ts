import { TypeResponses } from '../../../../lib';
import { Context, setup } from '../../setup';

describe('Live types', () => {
    const context = new Context();
    setup(context);

    let response: TypeResponses.ListContentTypesResponse;

    beforeAll(async () => {
        response = await context.deliveryClient.types().toPromise();
    });

    it(`types should be defined`, () => {
        expect(response).toBeDefined();
    });

    it(`types should have pagination`, () => {
        expect(response.pagination).toBeDefined();
    });

    it(`there should be at least 1 type`, () => {
        expect(response.items.length).toBeGreaterThan(0);
    });

    it(`elements should be defined`, () => {
        expect(response.items[0].elements).toBeDefined();
    });

    it(`system properties should be defined`, () => {
        expect(response.items[0].system).toBeDefined();
    });

    it(`pagination should be defined`, () => {
        expect(response.pagination).toBeDefined();
    });
});
