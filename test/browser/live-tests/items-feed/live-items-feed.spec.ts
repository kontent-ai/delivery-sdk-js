import { ContentItem, IKontentNetworkResponse, ItemResponses } from '../../../../lib';
import { Actor, Context, Movie, setup } from '../../setup';

describe('Live items feed', () => {
    const context = new Context();
    setup(context);

    let response: IKontentNetworkResponse<ItemResponses.ListItemsFeedResponse<any>>;

    beforeAll(async () => {
        response = await context.deliveryClient.itemsFeed().toPromise();
    });

    it(`Response should be of proper type`, () => {
        expect(response.data).toEqual(jasmine.any(ItemResponses.ListItemsFeedResponse));
    });

    it(`Response should have all properties assigned`, () => {
        expect(response.data.items).toEqual(jasmine.any(Array));
        expect(response.data.items.length).toBeGreaterThan(0);
        expect(response.xContinuationToken).toBeUndefined();
        expect(Object.keys(response.data.linkedItems).length).toBeGreaterThan(0);

        for (const item of response.data.items) {
            if (item.system.type === 'movie') {
                expect(item).toEqual(jasmine.any(Movie));
            } else if (item.system.type === 'actor') {
                expect(item).toEqual(jasmine.any(Actor));
            } else {
                expect(item).toEqual(jasmine.any(ContentItem));
            }

            expect(item.system).toBeDefined();
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
