import { Responses } from '../../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './list-languages.spec.json';

describe('List languages', () => {
    const context = new Context();
    setup(context);

    let response: Responses.IListLanguagesResponse<string>;

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(responseJson).languages().toPromise()).data;
    });

    it(`Response should have all properties assigned`, () => {
        expect(response.items.length).toEqual(responseJson.languages.length);

        for (const item of response.items) {
            const originalItem = responseJson.languages.find((m) => m.system.id === item.system.id);

            if (!originalItem) {
                throw Error(`Invalid language '${item.system.id}'`);
            }

            expect(item.system.id).toEqual(originalItem.system.id);
            expect(item.system.name).toEqual(originalItem.system.name);
            expect(item.system.codename).toEqual(originalItem.system.codename);
        }
    });
});
