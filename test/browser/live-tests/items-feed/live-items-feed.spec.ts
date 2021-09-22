import { IKontentNetworkResponse, ItemResponses } from '../../../../lib';
import { Context, setup } from '../../setup';

describe('Live items feed', () => {
    const context = new Context();
    setup(context);

    let response: IKontentNetworkResponse<ItemResponses.IListItemsFeedResponse>;

    beforeAll(async () => {
        response = await context.deliveryClient.itemsFeed().toPromise();
    });

    it(`Response should have all properties assigned`, () => {
        expect(response.data.items).toEqual(jasmine.any(Array));
        expect(response.data.items.length).toBeGreaterThan(0);
        expect(response.xContinuationToken).toBeUndefined();
        expect(Object.keys(response.data.linkedItems).length).toBeGreaterThan(0);

        for (const item of response.data.items) {
            expect(item.system).toBeDefined();
            expect(item.elements).toBeDefined();
            expect(item._raw).toBeDefined();
        }
    });

    it(`debug property should be set for all items`, () => {
        response.data.items.forEach((item) => {
            expect(item._raw).toBeDefined();
            expect(item._raw.elements).toBeDefined();
        });
    });
});
