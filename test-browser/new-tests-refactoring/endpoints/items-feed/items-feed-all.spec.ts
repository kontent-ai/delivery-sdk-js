import { ContentItem, ItemResponses } from '../../../../lib';
import { Actor, defaultTypeResolvers, Movie } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../setup';
import * as responseJson from './items-feed.spec.json';

describe('Items feed all', () => {
    let response: ItemResponses.ItemsFeedAllResponse<Movie>;

    beforeAll(done => {
        getDeliveryClientWithJsonAndHeaders(responseJson, [], {
            projectId: 'xx',
            isDeveloperMode: true,
            typeResolvers: defaultTypeResolvers
        })
            .itemsFeedAll<Movie>()
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
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`Debug should be an array of responses`, () => {
        expect(response.debug).toEqual(jasmine.any(Array));

        if (response.debug) {
            expect(response.debug.length).toEqual(1);
        }
    });

    it(`Response should be of proper type`, () => {
        expect(response).toEqual(jasmine.any(ItemResponses.ItemsFeedAllResponse));
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
