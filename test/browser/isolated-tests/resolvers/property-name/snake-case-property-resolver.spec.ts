import { getDeliveryClientWithJson } from '../../../setup';
import { Elements, IContentItem, Responses, snakeCasePropertyNameResolver } from '../../../../../lib';
import * as warriorJson from './base-case-property-resolver.spec.json';

type MockWarrior = IContentItem<{
    first_name: Elements.TextElement;
    last_name: Elements.TextElement;
    age: Elements.NumberElement;
    residence: Elements.TextElement;
    city: Elements.TextElement;
}>;

describe('Snake case property resolver', () => {
    let response: Responses.IViewContentItemResponse<MockWarrior>;

    beforeAll(async () => {
        response = await (
            await getDeliveryClientWithJson(warriorJson, {
                propertyNameResolver: snakeCasePropertyNameResolver,
                environmentId: 'X'
            })
                .item<MockWarrior>('x')
                .toPromise()
        ).data;
    });

    it(`checks element is assigned #1`, () => {
        expect(response.item.elements.first_name.value).toEqual(warriorJson.item.elements.first_name.value);
    });

    it(`checks element is assigned #2`, () => {
        expect(response.item.elements.last_name.value).toEqual(warriorJson.item.elements.last__name.value);
    });

    it(`checks element is assigned #3`, () => {
        expect(response.item.elements.age.value).toEqual(warriorJson.item.elements.age_.value);
    });

    it(`checks element is assigned #4`, () => {
        expect(response.item.elements.residence.value).toEqual(warriorJson.item.elements._residence.value);
    });

    it(`checks element is assigned #5`, () => {
        expect(response.item.elements.city.value).toEqual(warriorJson.item.elements.____city___.value);
    });
});
