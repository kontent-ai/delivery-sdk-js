import { IDeliveryNetworkResponse, Responses } from '../../../../../lib';
import { Context, Movie, setup } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../../setup';
import * as responseJson from './items-feed.spec.json';

describe('Items feed', () => {
    const context = new Context();
    setup(context);

    let response: IDeliveryNetworkResponse<Responses.IListItemsFeedResponse<Movie>, any>;

    beforeAll(async () => {
        response = await getDeliveryClientWithJsonAndHeaders(
            responseJson,
            {
                environmentId: 'x',
            },
            [
                {
                    value: 'TokenX',
                    header: 'X-Continuation'
                }
            ]
        )
            .itemsFeed<Movie>()
            .toPromise();
    });

    it(`Continuation token should be set`, () => {
        expect(response.xContinuationToken).toEqual('TokenX');
    });

});
