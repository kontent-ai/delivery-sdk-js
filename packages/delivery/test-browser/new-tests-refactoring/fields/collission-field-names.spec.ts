import { ContentItem, ContentItemSystemAttributes, Fields } from '../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './collission-field-names.spec.json';

describe(`Collision field names ('system' & 'debug')`, () => {
    let item: ContentItem;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson).item('x')
            .toObservable()
            .subscribe(result => {
                item = result.item;
                done();
            });
    });

    it(`Field with codename 'debug' should be remapped`, () => {
        const newElementsField = item['_debug'] as Fields.TextField;

        expect(newElementsField).toEqual(jasmine.any(Fields.TextField));
        expect(newElementsField.value).toEqual(responseJson.item.elements.debug.value);

        // original elements should still be mapped
        expect(responseJson.item.elements.title.value).toEqual(item.title.value);
    });

    it(`Field with codename 'system' should be remapped`, () => {
        expect(responseJson.item.elements.system).toBeDefined();

        const systemField = item['_system'] as Fields.TextField;

        expect(systemField).toEqual(jasmine.any(Fields.TextField));
        expect(systemField.value).toEqual(responseJson.item.elements.system.value);

        // original system attributes should still be mapped
        expect(item.system).toEqual(jasmine.any(ContentItemSystemAttributes));
    });

});

