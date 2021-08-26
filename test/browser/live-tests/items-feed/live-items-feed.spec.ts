import { ContentItem, ItemResponses } from '../../../../lib';
import { Actor, Context, Movie, setup } from '../../setup';

describe('Live items feed', () => {
    const context = new Context();
    setup(context);

    let response: ItemResponses.ItemsFeedResponse;

    beforeAll(async () => {
        response = await context.deliveryClient.itemsFeed().toPromise();
    });

    it(`Response should be of proper type`, () => {
        expect(response).toEqual(jasmine.any(ItemResponses.ItemsFeedResponse));
    });

    it(`Response should have all properties assigned`, () => {
        expect(response.items).toEqual(jasmine.any(Array));
        expect(response.items.length).toBeGreaterThan(0);
        expect(response.continuationToken).toBeUndefined();
        expect(Object.keys(response.linkedItems).length).toBeGreaterThan(0);

        for (const item of response.items) {
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
        response.items.forEach((item) => {
            expect(item._raw).toBeDefined();
            expect(item._raw.elements).toBeDefined();
        });
    });
});
