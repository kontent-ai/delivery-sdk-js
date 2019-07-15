import { ContentItem, FieldModels, Fields, FieldType } from '../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './custom-field.spec.json';

class ColorElement extends Fields.CustomField  {

    public red: number;
    public green: number;
    public blue: number;

    constructor(
        public field: FieldModels.IFieldMapWrapper
    ) {
        super(field);

        const parsed = JSON.parse(field.rawField.value);
        this.red = parsed.red;
        this.green = parsed.green;
        this.blue = parsed.blue;
    }
}

class MarkdownElement extends Fields.CustomField {

    public isMarkdown = true;

    constructor(
        public field: FieldModels.IFieldMapWrapper,
    ) {
        super(field);
    }
}

describe('Custom field with custom model', () => {
    let item: ContentItem;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson, {
            projectId: '',
            fieldResolver: (fieldWrapper) => {
                const responseItem = responseJson.items[0];
                const colorElement = responseJson.items[0].elements.color;
                const markdownElement = responseJson.items[0].elements.markdown;

                if (fieldWrapper.contentTypeSystem.type === responseItem.system.type && fieldWrapper.rawField.name === colorElement.name) {
                    return new ColorElement(fieldWrapper);
                }

                if (fieldWrapper.contentTypeSystem.type === responseItem.system.type && fieldWrapper.rawField.name === markdownElement.name) {
                    return new MarkdownElement(fieldWrapper);
                }
                return undefined;
            }
        }).items()
            .toObservable()
            .subscribe(result => {
                item = result.items[0];
                done();
            });
    });

    it(`Color element should be mapped to ColorElement`, () => {
        const field = item.color as ColorElement;
        const rawField = responseJson.items[0].elements.color;

        expect(field).toEqual(jasmine.any(ColorElement));

        expect(field.red).toEqual(167);
        expect(field.green).toEqual(96);
        expect(field.blue).toEqual(197);

        expect(field.name).toEqual(rawField.name);
        expect(field.type).toEqual(FieldType.Custom);
        expect(field.value).toEqual(rawField.value);
    });

    it(`Markdown element should be mapped to MarkdownElement`, () => {
        const field = item.markdown as MarkdownElement;
        const rawField = responseJson.items[0].elements.markdown;

        expect(field).toEqual(jasmine.any(MarkdownElement));

        expect(field.name).toEqual(rawField.name);
        expect(field.type).toEqual(FieldType.Custom);
        expect(field.value).toEqual(rawField.value);
    });

});

