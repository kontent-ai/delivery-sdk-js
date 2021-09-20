import { ContentItem, IKontentNetworkResponse, ItemResponses } from '../../../../../lib';
import { Actor, Context, defaultTypeResolvers, IMovieElements, setup } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../setup';
import * as responseJson from './items-feed.spec.json';

describe('Items feed', () => {
    const context = new Context();
    setup(context);

    let response: IKontentNetworkResponse<ItemResponses.ListItemsFeedResponse<IMovieElements>>;

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
            .itemsFeed<IMovieElements>()
            .queryConfig({
                richTextResolver: (item) => {
                    if (item.system.type === 'actor') {
                        const actor = item as Actor;
                        return `actor-${actor.elements.firstName.value}`;
                    }
                    return '';
                }
            })
            .toPromise();
    });

    it(`Continuation token should be set`, () => {
        expect(response.xContinuationToken).toEqual('TokenX');
    });

    it(`Response should be of proper type`, () => {
        expect(response.data).toEqual(jasmine.any(ItemResponses.ListItemsFeedResponse));
    });

    it(`Response should have all properties assigned`, () => {
        expect(response.data.items.length).toEqual(responseJson.items.length);

        for (const item of response.data.items) {
            expect(item).toEqual(jasmine.any(ContentItem));
        }
    });

    it(`Debug property should be set for all items`, () => {
        response.data.items.forEach((item) => {
            expect(item._raw).toBeDefined();
            expect(item._raw.elements).toBeDefined();
        });
    });

    it(`Rich text should be resolved`, () => {
        const html = response.data.items[0].elements.plot.resolveHtml();
        expect(html).toContain(`actor-Joel`);
        expect(html).toContain(`actor-Tom`);
    });
});
