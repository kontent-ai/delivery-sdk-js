import { ContentItem, ContentItemSystemAttributes, Elements } from '../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './collission-element-names.spec.json';

describe(`Collision element names ('system' & 'debug')`, () => {
    let item: ContentItem;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson).item('x')
            .toObservable()
            .subscribe(result => {
                item = result.item;
                done();
            });
    });

    it(`Element with codename 'debug' should be remapped`, () => {
        const newElementsElement = item['_debug'] as Elements.TextElement;

        expect(newElementsElement).toEqual(jasmine.any(Elements.TextElement));
        expect(newElementsElement.value).toEqual(responseJson.item.elements.debug.value);

        // original elements should still be mapped
        expect(responseJson.item.elements.title.value).toEqual(item.title.value);
    });

    it(`Element with codename 'system' should be remapped`, () => {
        expect(responseJson.item.elements.system).toBeDefined();

        const systemElement = item['_system'] as Elements.TextElement;

        expect(systemElement).toEqual(jasmine.any(Elements.TextElement));
        expect(systemElement.value).toEqual(responseJson.item.elements.system.value);

        // original system attributes should still be mapped
        expect(item.system).toEqual(jasmine.any(ContentItemSystemAttributes));
    });

});

