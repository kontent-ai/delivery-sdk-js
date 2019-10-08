import { ContentItem, Elements, ElementType } from '../../../../lib';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './custom-element.spec.json';

describe('Custom element', () => {
    let item: ContentItem;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson).items()
            .toObservable()
            .subscribe(result => {
                item = result.items[0];
                done();
            });
    });

    it(`Color element should be mapped to DefaultCustomElement`, () => {
        const element = item.color as Elements.DefaultCustomElement;
        const rawElement = responseJson.items[0].elements.color;

        expect(element).toEqual(jasmine.any(Elements.DefaultCustomElement));

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
        expect(element.value).toEqual(rawElement.value);
    });

    it(`Markdown element should be mapped to DefaultCustomElement`, () => {
        const element = item.markdown as Elements.DefaultCustomElement;
        const rawElement = responseJson.items[0].elements.markdown;

        expect(element).toEqual(jasmine.any(Elements.DefaultCustomElement));

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
        expect(element.value).toEqual(rawElement.value);
    });

    it(`Custom element should preserve null value`, () => {
        const element = new Elements.DefaultCustomElement({
            contentItemSystem: null as any,
            propertyName: 'x',
            rawElement: {
                name: 'y',
                type: ElementType.Custom,
                value: null
            }
        });

        expect(element.value).toBeNull();
    });

});

