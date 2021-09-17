import { ContentItem, ItemResponses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live item - base linked items', () => {
    const context = new Context();
    context.typeResolvers = [];
    setup(context);

    const movieCodename: string = 'warrior';
    let response: ItemResponses.ViewContentItemResponse<Movie>;

    beforeAll(async () => {
        response = (await context.deliveryClient.item<Movie>(movieCodename).toPromise()).data;
    });

    it(`verify linked items included in response and are of 'ContentItem' type`, () => {
        expect(Object.keys(response.linkedItems).length).toEqual(3);

        for (const key of Object.keys(response.linkedItems)) {
            const linkedItem = response.linkedItems[key];
            expect(linkedItem).toEqual(jasmine.any(ContentItem));
        }
    });
});
