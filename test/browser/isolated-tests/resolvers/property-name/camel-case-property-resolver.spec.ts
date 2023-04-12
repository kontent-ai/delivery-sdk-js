import { getDeliveryClientWithJson } from '../../../setup';
import { Elements, IContentItem, Responses, camelCasePropertyNameResolver } from '../../../../../lib';
import * as warriorJson from './base-case-property-resolver.spec.json';

type MockWarrior = IContentItem<{
    firstName: Elements.TextElement;
    lastName: Elements.TextElement;
    age: Elements.NumberElement;
    residence: Elements.TextElement;
    city: Elements.TextElement;
}>;

describe('Camel case property resolver', () => {
    let response: Responses.IViewContentItemResponse<MockWarrior>;

    beforeAll(async () => {
        response = await (
            await getDeliveryClientWithJson(warriorJson, {
                propertyNameResolver: camelCasePropertyNameResolver,
                projectId: 'X'
            })
                .item<MockWarrior>('x')
                .toPromise()
        ).data;
    });

    it(`checks element is assigned #1`, () => {
        expect(response.item.elements.firstName.value).toEqual(warriorJson.item.elements.first_name.value);
    });

    it(`checks element is assigned #2`, () => {
        expect(response.item.elements.lastName.value).toEqual(warriorJson.item.elements.last__name.value);
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
