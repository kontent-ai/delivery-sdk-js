import { IKontentNetworkResponse, ItemResponses } from '../../../../../lib';
import { Actor, Context, Movie, setup } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../../setup';
import * as responseJson from './items-feed.spec.json';

describe('Items feed', () => {
    const context = new Context();
    setup(context);

    let response: IKontentNetworkResponse<ItemResponses.IListItemsFeedResponse<Movie>>;

    beforeAll(async () => {
        response = await getDeliveryClientWithJsonAndHeaders(
            responseJson,
            {
                projectId: 'x',
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


    it(`Debug property should be set for all items`, () => {
        response.data.items.forEach((item) => {
            expect(item._raw).toBeDefined();
            expect(item._raw.elements).toBeDefined();
        });
    });

});
