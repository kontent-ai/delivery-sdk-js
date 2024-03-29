import { getDeliveryClientWithJson } from '../../../setup';
import { Responses, Elements } from '../../../../../lib';
import * as responseJson from './circular-referenced-linked-items-mapping.spec.json';

describe('Circular references in linked items', () => {
    let response: Responses.IViewContentItemResponse;

    const modularItemElement = 'related_articles';

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(responseJson).item('x').toPromise()).data;
    });

    it(`Response should be defines and there should be no stackoverflow exception logged`, () => {
        expect(response).toBeDefined();
    });

    it(`'coffee_processing_techniques' should have mapped items`, () => {
        const linkedItem = response.item;
        expect(linkedItem).toBeDefined();
        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement<any>).linkedItems.find(
                (m) => m.system.codename === 'on_roasts'
            )
        ).toBeDefined();
        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement<any>).linkedItems.find(
                (m) => m.system.codename === 'which_brewing_fits_you_'
            )
        ).toBeDefined();
    });

    it(`'on_roasts' should have mapped items `, () => {
        const linkedItemCodename = 'on_roasts';
        const linkedItem = response.linkedItems[linkedItemCodename];

        expect(linkedItem).toBeDefined();

        if (!linkedItem) {
            throw Error(`Item with codename '${linkedItemCodename}' was not found`);
        }

        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement<any>).linkedItems.find(
                (m) => m.system.codename === 'on_roasts'
            )
        ).toBeDefined();
        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement<any>).linkedItems.find(
                (m) => m.system.codename === 'which_brewing_fits_you_'
            )
        ).toBeDefined();
    });

    it(`'which_brewing_fits_you_' should have mapped items`, () => {
        const linkedItemCodename = 'which_brewing_fits_you_';
        const linkedItem = response.linkedItems[linkedItemCodename];

        expect(linkedItem).toBeDefined();

        if (!linkedItem) {
            throw Error(`Item with codename '${linkedItemCodename}' was not found`);
        }

        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement<any>).linkedItems.find(
                (m) => m.system.codename === 'on_roasts'
            )
        ).toBeDefined();
        expect(
            (linkedItem.elements[modularItemElement] as Elements.LinkedItemsElement<any>).linkedItems.find(
                (m) => m.system.codename === 'coffee_processing_techniques'
            )
        ).toBeDefined();
    });
});
