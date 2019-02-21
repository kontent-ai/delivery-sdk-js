import { ContentItem, ContentItemSystemAttributes, Fields } from '../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './collission-field-names.spec.json';

describe(`Collision field names ('system' & 'elements')`, () => {
    let item: ContentItem;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson).item('x')
            .getObservable()
            .subscribe(result => {
                item = result.item;
                done();
            });
    });

    it(`Field with codename 'elements' should be remapped`, () => {
        expect(responseJson.item.elements.elements).toBeDefined();
        const newElementsField = item['_elements'] as Fields.TextField;

        expect(newElementsField).toBeDefined();
        expect(newElementsField).toEqual(jasmine.any(Fields.TextField));
        expect(newElementsField.value).toEqual(responseJson.item.elements.elements.value);

        // original elements should still be mapped
        expect(item.elements).toBeDefined();
        expect(responseJson.item.elements.title.value).toEqual(item.elements.title.value);
    });

    it(`Field with codename 'system' should be remapped`, () => {
        expect(responseJson.item.elements.system).toBeDefined();

        const systemField = item['_system'] as Fields.TextField;

        expect(systemField).toBeDefined();
        expect(systemField).toEqual(jasmine.any(Fields.TextField));
        expect(systemField.value).toEqual(responseJson.item.elements.system.value);

        // original system attributes should still be mapped
        expect(item.system).toBeDefined();
        expect(item.system).toEqual(jasmine.any(ContentItemSystemAttributes));
    });

});

