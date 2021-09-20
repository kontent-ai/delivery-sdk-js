import { ContentItem, Elements, ElementType, ItemResponses, TypeResolver } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './linked-items-element.spec.json';

class Actor extends ContentItem<any> {
    constructor() {
        super();
    }
}

class Movie extends ContentItem<any> {
    public stars!: Elements.LinkedItemsElement<any>;
}

describe('Linked items element', () => {
    let response: ItemResponses.ViewContentItemResponse<any>;

    beforeAll(async () => {
        response = (
            await getDeliveryClientWithJson(responseJson, {
                projectId: '',
                typeResolvers: [
                    new TypeResolver('movie', (data) => new Movie()),
                    new TypeResolver('actor', (data) => new Actor())
                ]
            })
                .item<any>('x')
                .toPromise()
        ).data;
    });

    it(`Stars element should be mapped to LinkedItemsElement along with properties`, () => {
        const element = response.item.elements.stars;
        const rawElement = responseJson.item.elements.stars;

        expect(element).toEqual(jasmine.any(Elements.LinkedItemsElement));

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.ModularContent);
        expect(element.itemCodenames).toEqual(rawElement.value);

        const stars: Actor[] = element.value;
        expect(stars.length).toEqual(rawElement.value.length);
        for (const star of stars) {
            expect(star).toEqual(jasmine.any(Actor));
        }
    });
});
