import { Elements, ElementType, IContentItem } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './unknown-element.spec.json';

describe('Unknown element', () => {
    let item: IContentItem<any>;

    beforeAll(async () => {
        const response = (await getDeliveryClientWithJson(responseJson).items().toPromise()).data;

        item = response.items[0];
    });

    it(`Ufo element should be mapped to UnknownElement`, () => {
        const element = item.elements.ufo as Elements.IUnknownElement;
        const rawElement = responseJson.items[0].elements.ufo;

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Unknown);
        expect(element.value).toEqual(rawElement.value);
    });
});
