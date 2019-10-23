import { ContentItem, ItemResponses } from '../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../setup';
import * as responseJson from './items-feed.spec.json';

describe('Items feed', () => {
    const context = new Context();
    setup(context);

    let response: ItemResponses.ItemsFeedResponse;

    beforeAll(done => {
        getDeliveryClientWithJsonAndHeaders(responseJson, [
            {
                header: 'X-Continuation',
                value: 'tokenX'
            }
        ])
            .itemsFeed()
            .toObservable()
            .subscribe(result => {
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

    it(`debug property should be set for all items`, () => {
        response.items.forEach(item => {
            expect(item._raw).toBeDefined();
            expect(item._raw.elements).toBeDefined();
        });
    });
});
