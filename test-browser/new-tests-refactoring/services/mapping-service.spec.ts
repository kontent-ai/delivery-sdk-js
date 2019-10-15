import { ContentItem, ItemResponses } from '../../../lib';
import { getTestDeliveryClient } from '../setup';
import * as responseJson from './mapping-service.spec.json';

describe('Mapping service', () => {

    const client = getTestDeliveryClient({
        projectId: 'x',
        isDeveloperMode: true
    });

    const listingResponse: ItemResponses.ListContentItemsResponse = client.mappingService.listContentItemsResponse({
        data: responseJson,
        response: null,
        headers: [],
        status: 200
    }, {});

    it(`Listing response should be mapped correctly`, () => {
        expect(listingResponse).toEqual(jasmine.any(ItemResponses.ListContentItemsResponse));
        expect(listingResponse.debug).toBeDefined();

        if (listingResponse.debug) {
            expect(listingResponse.debug.response).toBeNull();
        }

        expect(listingResponse.items.length).toEqual(responseJson.items.length);

        for (const item of listingResponse.items) {
            const rawItem = responseJson.items.find(m => m.system.id === item.system.id);
            if (!rawItem) {
                throw Error(`Raw item with id '${item.system.id}' could not be found`);
            }

            expect(item).toEqual(jasmine.any(ContentItem));
        }
    });
});

