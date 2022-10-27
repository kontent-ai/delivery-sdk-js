import { Responses } from '../../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './sync-changes.spec.json';

describe('Sync changes', () => {
    const context = new Context();
    setup(context);

    let response: Responses.ISyncChangesResponse;

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(responseJson).syncChanges().toPromise()).data;
    });

    it(`Response should have all properties assigned`, () => {
        expect(response.items.length).toEqual(responseJson.items.length);

        for (const item of response.items) {
            const originalItem = responseJson.items.find((m) => m.id === item.id);

            if (!originalItem) {
                throw Error(`Invalid item '${item.id}'`);
            }

            expect(item.id).toEqual(originalItem.id);
            expect(item.changeType).toEqual(originalItem.change_type);
            expect(item.codename).toEqual(originalItem.codename);
            expect(item.collection).toEqual(originalItem.collection);
            expect(item.language).toEqual(originalItem.language);
            expect(item.timestamp).toEqual(originalItem.timestamp);
            expect(item.type).toEqual(originalItem.type);
        }
    });
});
