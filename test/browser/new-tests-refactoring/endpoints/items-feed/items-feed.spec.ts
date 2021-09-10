import { ContentItem, ItemResponses } from '../../../../../lib';
import { Actor, Context, defaultTypeResolvers, Movie, setup } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../setup';
import * as responseJson from './items-feed.spec.json';

describe('Items feed', () => {
    const context = new Context();
    setup(context);

    let response: ItemResponses.ListItemsFeedResponse<Movie>;

    beforeAll(async () => {
        response = await getDeliveryClientWithJsonAndHeaders(
            responseJson,
            {
                projectId: 'x',
                typeResolvers: defaultTypeResolvers
            },
            [
                {
                    value: 'TokenX',
                    header: 'X-Continuation'
                }
            ]
        )
            .itemsFeed<Movie>()
            .queryConfig({
                richTextResolver: (item) => {
                    if (item.system.type === 'actor') {
                        const actor = item as Actor;
                        return `actor-${actor.firstName.value}`;
                    }
                    return '';
                }
            })
            .toPromise();
    });

    it(`Continuation token should be set`, () => {
        expect(response.continuationToken).toEqual('TokenX');
    });

    it(`Response should be of proper type`, () => {
        expect(response).toEqual(jasmine.any(ItemResponses.ListItemsFeedResponse));
    });

    it(`Response should have all properties assigned`, () => {
        expect(response.items.length).toEqual(responseJson.items.length);

        for (const item of response.items) {
            expect(item).toEqual(jasmine.any(ContentItem));
        }
    });

    it(`Debug property should be set for all items`, () => {
        response.items.forEach((item) => {
            expect(item._raw).toBeDefined();
            expect(item._raw.elements).toBeDefined();
        });
    });

    it(`Rich text should be resolved`, () => {
        const html = response.items[0].plot.resolveHtml();
        expect(html).toContain(`actor-Joel`);
        expect(html).toContain(`actor-Tom`);
    });
});
