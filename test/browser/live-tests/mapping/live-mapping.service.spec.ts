import { INetworkResponse, ItemContracts, Responses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live mapping service', () => {
    const context = new Context();
    setup(context);

    const movieCodename: string = 'warrior';
    let response: INetworkResponse<Responses.IViewContentItemResponse<Movie>, ItemContracts.IViewContentItemContract>;

    beforeAll(async () => {
        response = await context.deliveryClient.item<Movie>(movieCodename).queryConfig({}).toPromise();
    });

    it(`raw response should be available for mapping from stored json (with mapping service)`, () => {
        const contractJson = response.response.data;
        const reMappedResponse = context.deliveryClient.mappingService.viewContentItemResponse<Movie>(contractJson);
        expect(reMappedResponse).toBeDefined();
        expect(reMappedResponse.item.system.codename).toEqual(movieCodename);
        expect(reMappedResponse.item.elements.title.value).toEqual('Warrior');
    });

    it(`raw response should be available for mapping from stored json (with query)`, () => {
        const contractJson = response.response.data;
        const reMappedResponse = context.deliveryClient.item<Movie>(movieCodename).map(contractJson);
        expect(reMappedResponse).toBeDefined();
        expect(reMappedResponse.item.system.codename).toEqual(movieCodename);
        expect(reMappedResponse.item.elements.title.value).toEqual('Warrior');
    });
});
