import { getDeliveryClientWithJson } from '../../setup';
import { Elements, IContentItem, ItemResponses, PropertyNameResolver } from '../../../../lib';
import * as warriorJson from '../fake-data/fake-warrior-response.json';

type MockMovie = IContentItem<{
    titleTest: Elements.ITextElement;
    test_released: Elements.IDateTimeElement;
    justNumber: Elements.INumberElement;
}>;

describe('Property resolver', () => {
    const propertyResolver: PropertyNameResolver = (contentType, element) => {
        if (element === 'title') {
            return 'titleTest';
        }
        if (element === 'released') {
            return 'test_released';
        }
        if (element === 'length') {
            return 'justNumber';
        }
        return element;
    };

    let response: ItemResponses.IViewContentItemResponse<MockMovie>;

    beforeAll(async () => {
        response = await (
            await getDeliveryClientWithJson(warriorJson, {
                propertyNameResolver: propertyResolver,
                projectId: 'X'
            })
                .item<MockMovie>('x')
                .toPromise()
        ).data;
    });

    it(`checks element is assigned #1`, () => {
        expect(response.item.elements.titleTest.value).toEqual('Warrior');
    });

    it(`checks element is assigned #2`, () => {
        expect(response.item.elements.test_released.value).toEqual(new Date('2011-09-09T00:00:00Z'));
    });

    it(`checks element is assigned #3`, () => {
        expect(response.item.elements.justNumber.value).toEqual(151);
    });
});
