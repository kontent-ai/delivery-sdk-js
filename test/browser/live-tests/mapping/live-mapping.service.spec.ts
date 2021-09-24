import { IKontentNetworkResponse, ItemResponses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live mapping service', () => {
    const context = new Context();
    setup(context);

    const movieCodename: string = 'warrior';
    let response: IKontentNetworkResponse<ItemResponses.IViewContentItemResponse<Movie>>;

    beforeAll(async () => {
        response = await context.deliveryClient.item<Movie>(movieCodename).queryConfig({}).toPromise();
    });

    it(`raw response should be available for mapping from stored json`, () => {
        const rawJson = response.response.data;
        const reMappedResponse = context.deliveryClient.mappingService.viewContentItemResponse<Movie>(rawJson);
        expect(reMappedResponse).toBeDefined();
        expect(reMappedResponse.item.system.codename).toEqual(movieCodename);
        expect(reMappedResponse.item.elements.title.value).toEqual('Warrior');
    });
});
