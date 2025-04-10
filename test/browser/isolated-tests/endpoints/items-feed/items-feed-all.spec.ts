import { IContentItem, IGroupedNetworkResponse, Responses } from '../../../../../lib';
import { Context, Movie, setup } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../../setup';
import * as responseJson from './items-feed-all.spec.json';

describe('Items feed all', () => {
    const context = new Context();
    setup(context);

    let response: IGroupedNetworkResponse<Responses.IListItemsFeedAllResponse<IContentItem>>;

    beforeAll(async () => {
        response = await getDeliveryClientWithJsonAndHeaders(
            responseJson,
            {
                environmentId: 'x'
            },
            []
        )
            .itemsFeed<Movie>()
            .queryConfig({
                disableItemLinking: false
            })
            .toAllPromise();
    });

    it(`Validate responses counts`, () => {
        expect(response.responses.length).toEqual(1);
    });

    it(`Validate items count`, () => {
        expect(response.data.items.length).toEqual(responseJson.items.length);
    });
});
