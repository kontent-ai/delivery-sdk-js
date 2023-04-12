import { Elements, Responses } from '../../../../../lib';
import { getTestDeliveryClient } from '../../../setup';
import * as responseJson from './linked-items-mapping.json';

describe('Linked items mapping disabled', () => {
    const client = getTestDeliveryClient({
        projectId: 'x',
        linkedItemsReferenceHandler: 'ignore'
    });

    const response: Responses.IViewContentItemResponse = client.mappingService.viewContentItemResponse(responseJson);
    const modularItemElement = 'related_articles';

    it(`'coffee_processing_techniques' should have mapped items`, () => {
        const linkedItem = response.item;
        expect(linkedItem).toBeDefined();
        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement).linkedItems.find(
                (m) => m.system.codename === 'on_roasts'
            )
        ).toBeUndefined();
        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement).linkedItems.find(
                (m) => m.system.codename === 'which_brewing_fits_you_'
            )
        ).toBeUndefined();
    });

    it(`'on_roasts' should not have parent object in its own linked items `, () => {
        const linkedItemCodename = 'on_roasts';
        const linkedItem = response.linkedItems[linkedItemCodename];

        expect(linkedItem).toBeDefined();

        if (!linkedItem) {
            throw Error(`Item with codename '${linkedItemCodename}' was not found`);
        }

        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement).linkedItems.find(
                (m) => m.system.codename === 'on_roasts'
            )
        ).toBeUndefined();
        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement).linkedItems.find(
                (m) => m.system.codename === 'which_brewing_fits_you_'
            )
        ).toBeUndefined();
    });

    it(`'which_brewing_fits_you_' should not have parent object in its own linked items `, () => {
        const linkedItemCodename = 'which_brewing_fits_you_';
        const linkedItem = response.linkedItems[linkedItemCodename];

        expect(linkedItem).toBeDefined();

        if (!linkedItem) {
            throw Error(`Item with codename '${linkedItemCodename}' was not found`);
        }

        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement).linkedItems.find(
                (m) => m.system.codename === 'on_roasts'
            )
        ).toBeUndefined();
        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement).linkedItems.find(
                (m) => m.system.codename === 'coffee_processing_techniques'
            )
        ).toBeUndefined();
    });
});
