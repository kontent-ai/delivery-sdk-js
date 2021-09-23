import { IContentItem, Elements, ElementType } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './custom-element.spec.json';

describe('Custom element', () => {
    let item: IContentItem<any>;
    beforeAll(async () => {
        const response = (await getDeliveryClientWithJson(responseJson).items().toPromise()).data;

        item = response.items[0];
    });

    it(`Color element should be mapped to DefaultCustomElement`, () => {
        const element = item.elements.color as Elements.ICustomElement;
        const rawElement = responseJson.items[0].elements.color;

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
        expect(element.value).toEqual(rawElement.value);
    });

    it(`Markdown element should be mapped to DefaultCustomElement`, () => {
        const element = item.elements.markdown as Elements.ICustomElement;
        const rawElement = responseJson.items[0].elements.markdown;

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
        expect(element.value).toEqual(rawElement.value);
    });
});
