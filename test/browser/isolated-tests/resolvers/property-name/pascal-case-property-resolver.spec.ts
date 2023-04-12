import { getDeliveryClientWithJson } from '../../../setup';
import { Elements, IContentItem, Responses, pascalCasePropertyNameResolver } from '../../../../../lib';
import * as warriorJson from './base-case-property-resolver.spec.json';

type MockWarrior = IContentItem<{
    FirstName: Elements.TextElement;
    LastName: Elements.TextElement;
    Age: Elements.NumberElement;
    Residence: Elements.TextElement;
    City: Elements.TextElement;
}>;

describe('Pascal case property resolver', () => {
    let response: Responses.IViewContentItemResponse<MockWarrior>;

    beforeAll(async () => {
        response = await (
            await getDeliveryClientWithJson(warriorJson, {
                propertyNameResolver: pascalCasePropertyNameResolver,
                projectId: 'X'
            })
                .item<MockWarrior>('x')
                .toPromise()
        ).data;
    });

    it(`checks element is assigned #1`, () => {
        expect(response.item.elements.FirstName.value).toEqual(warriorJson.item.elements.first_name.value);
    });

    it(`checks element is assigned #2`, () => {
        expect(response.item.elements.LastName.value).toEqual(warriorJson.item.elements.last__name.value);
    });

    it(`checks element is assigned #3`, () => {
        expect(response.item.elements.Age.value).toEqual(warriorJson.item.elements.age_.value);
    });

    it(`checks element is assigned #4`, () => {
        expect(response.item.elements.Residence.value).toEqual(warriorJson.item.elements._residence.value);
    });

    it(`checks element is assigned #5`, () => {
        expect(response.item.elements.City.value).toEqual(warriorJson.item.elements.____city___.value);
    });
});
