import { ContentItem, ItemResponses } from '../../../../lib';
import { Actor, Context, defaultTypeResolvers, Movie, setup } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../setup';
import * as responseJson from './items-feed.spec.json';

describe('Items feed', () => {
    const context = new Context();
    setup(context);

    let response: ItemResponses.ItemsFeedResponse<Movie>;

    beforeAll(done => {
        getDeliveryClientWithJsonAndHeaders(
            responseJson,
            [
                {
                    header: 'X-Continuation',
                    value: 'tokenX'
                }
            ],
            {
                projectId: 'x',
                typeResolvers: defaultTypeResolvers
            }
        )
            .itemsFeed<Movie>()
            .queryConfig({
                richTextResolver: item => {
                    if (item.system.type === 'actor') {
                        const actor = item as Actor;
                        return `actor-${actor.firstName.value}`;
                    }
                    return '';
                }
            })
            .toObservable()
            .subscribe((result) => {
                response = result;
                done();
            });
    });

    it(`Continuation token should be set`, () => {
        expect(response.continuationToken).toEqual('tokenX');
    });

    it(`Response should be of proper type`, () => {
        expect(response).toEqual(jasmine.any(ItemResponses.ItemsFeedResponse));
    });

    it(`Response should have all properties assigned`, () => {
        expect(response.items.length).toEqual(responseJson.items.length);

        for (const item of response.items) {
            expect(item).toEqual(jasmine.any(ContentItem));
        }
    });

    it(`Debug property should be set for all items`, () => {
        response.items.forEach(item => {
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
