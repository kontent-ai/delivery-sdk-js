import { Responses } from '../../../../lib';
import { Context, setup } from '../../setup';

describe('Custom URL', () => {
    const itemsUrl: string = 'https://deliver.kontent.ai/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items?system.type=movie';

    const context = new Context();
    setup(context);

    let responseItems: Responses.IListContentItemsResponse<any>;

    beforeAll(async () => {
        responseItems = (await context.deliveryClient.items<any>().withCustomUrl(itemsUrl).toPromise()).data;
    });

    it(`items should be defined`, () => {
        expect(responseItems).toBeDefined();
    });
});
