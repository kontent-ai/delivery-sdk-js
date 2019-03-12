import { ItemResponses } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Responses', () => {

    const context = new Context();
    setup(context);

    it(`DeliveryItemListingResponse should be initialize properties for invalid item`, () => {
        const response = new ItemResponses.DeliveryItemListingResponse(undefined as any, {} as any, {}, {} as any);
        const responseWithEmptyArray = new ItemResponses.DeliveryItemListingResponse([] as any, {} as any, {}, {} as any);

        expect(response.isEmpty).toEqual(true);
        expect(response.firstItem).toEqual(undefined);
        expect(response.lastItem).toEqual(undefined);
        expect(Object.keys(response.linkedItems).length).toEqual(0);
        expect(responseWithEmptyArray.firstItem).toEqual(undefined);
        expect(responseWithEmptyArray.lastItem).toEqual(undefined);
    });

    it(`DeliveryItemListingResponse should be initialize properties for invalid item`, () => {
        const response = new ItemResponses.DeliveryItemResponse(undefined as any, {}, {} as any);
        const responseWithItem = new ItemResponses.DeliveryItemResponse({ 'test': 1 } as any, {}, {} as any);


        expect(Object.keys(response.linkedItems).length).toEqual(0);
        expect(response.isEmpty).toEqual(true);
        expect(responseWithItem.isEmpty).toEqual(false);
    });

});

