import { ItemResponses } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Responses', () => {

    const context = new Context();
    setup(context);

    it(`DeliveryItemListingResponse should be initialize properties for invalid item`, () => {
        const response = new ItemResponses.DeliveryItemListingResponse(null as any, {} as any, {} as any);
        const responseWithEmptyArray = new ItemResponses.DeliveryItemListingResponse([] as any, {} as any, {} as any);

        expect(response.isEmpty).toEqual(true);
        expect(response.firstItem).toEqual(undefined as any);
        expect(response.lastItem).toEqual(undefined as any);
        expect(responseWithEmptyArray.firstItem).toEqual(undefined as any);
        expect(responseWithEmptyArray.lastItem).toEqual(undefined as any);
    });

    it(`DeliveryItemListingResponse should be initialize properties for invalid item`, () => {
        const response = new ItemResponses.DeliveryItemResponse(null as any, {} as any);
        const responseWithItem = new ItemResponses.DeliveryItemResponse({ 'test': 1 } as any, {} as any);

        expect(response.isEmpty).toEqual(true);
        expect(responseWithItem.isEmpty).toEqual(false);
    });

});

