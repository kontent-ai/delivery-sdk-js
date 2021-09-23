import { ItemResponses } from '../../../../lib';
import { getTestDeliveryClient } from '../../setup';
import * as responseJson from './mapping-service.spec.json';

describe('Mapping service', () => {
    const client = getTestDeliveryClient({
        projectId: 'x'
    });

    const listingResponse: ItemResponses.IListContentItemsResponse = client.mappingService.listContentItemsResponse(
        responseJson,
        {}
    );

    it(`Listing response should be mapped correctly`, () => {
        expect(listingResponse.items.length).toEqual(responseJson.items.length);

        for (const item of listingResponse.items) {
            const rawItem = responseJson.items.find((m) => m.system.id === item.system.id);
            if (!rawItem) {
                throw Error(`Raw item with id '${item.system.id}' could not be found`);
            }

            expect(item.system.id).toEqual(rawItem.system.id);
            expect(item.system.codename).toEqual(rawItem.system.codename);
        }
    });
});
