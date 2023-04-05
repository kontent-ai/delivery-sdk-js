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
            const originalItem = responseJson.items.find((m) => m.data.system.id === item.data.system.id);

            if (!originalItem) {
                throw Error(`Invalid item '${item.data.system.id}'`);
            }

            expect(item.timestamp).toEqual(originalItem.timestamp);
            expect(item.changeType).toEqual(originalItem.change_type);

            expect(item.data.system.codename).toEqual(originalItem.data.system.codename);
            expect(item.data.system.type).toEqual(originalItem.data.system.type);
            expect(item.data.system.collection).toEqual(originalItem.data.system.collection);
            expect(item.data.system.language).toEqual(originalItem.data.system.language);
            expect(item.data.system.name).toEqual(originalItem.data.system.name);
            expect(item.data.system.workflowStep).toEqual(originalItem.data.system.workflow_step);
            expect(item.data.system.lastModified).toEqual(originalItem.data.system.last_modified);

            if (originalItem.data.elements) {
                expect(item.data.elements).toEqual(originalItem.data.elements);
            } else {
                expect(item.data.elements).toEqual({});
            }
        }
    });
});
