import { IKontentNetworkResponse, ItemContracts, ItemResponses } from '../../../../lib';
import { Context, setup } from '../../setup';

describe('Live items feed', () => {
    const context = new Context();
    setup(context);

    let response: IKontentNetworkResponse<ItemResponses.IListItemsFeedResponse, ItemContracts.IItemsFeedContract>;

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
        }
    });
});
