import { ContentItem, Fields, FieldType } from '../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './custom-field.spec.json';

describe('Custom field', () => {
    let item: ContentItem;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson).items()
            .toObservable()
            .subscribe(result => {
                item = result.items[0];
                done();
            });
    });

    it(`Color element should be mapped to CustomField`, () => {
        const field = item.color as Fields.CustomField;
        const rawField = responseJson.items[0].elements.color;

        expect(field).toEqual(jasmine.any(Fields.CustomField));

        expect(field.name).toEqual(rawField.name);
        expect(field.type).toEqual(FieldType.Custom);
        expect(field.value).toEqual(rawField.value);
    });

    it(`Markdown element should be mapped to CustomField`, () => {
        const field = item.markdown as Fields.CustomField;
        const rawField = responseJson.items[0].elements.markdown;

        expect(field).toEqual(jasmine.any(Fields.CustomField));

        expect(field.name).toEqual(rawField.name);
        expect(field.type).toEqual(FieldType.Custom);
        expect(field.value).toEqual(rawField.value);
    });

});

