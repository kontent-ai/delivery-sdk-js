import { ContentItem, FieldModels } from '../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './custom-field.spec.json';

class ColorElement implements FieldModels.IField {

    public red: number;
    public green: number;
    public blue: number;

    constructor(
        public name: string,
        public type: string,
        public value: string
    ) {
        const parsed = JSON.parse(value);
        this.red = parsed.red;
        this.green = parsed.green;
        this.blue = parsed.blue;
    }
}

class MarkdownElement implements FieldModels.IField {

    public isMarkdown = true;

    constructor(
        public name: string,
        public type: string,
        public value: string
    ) {
    }
}

describe('Custom field with custom model', () => {
    let item: ContentItem;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson, {
            projectId: '',
            fieldResolver: (type, element, data) => {
                const responseItem = responseJson.items[0];
                const colorElement = responseJson.items[0].elements.color;
                const markdownElement = responseJson.items[0].elements.markdown;

                if (type === responseItem.system.type && element === colorElement.name) {
                    return new ColorElement(colorElement.name, 'color', data);
                }

                if (type === responseItem.system.type && element === markdownElement.name) {
                    return new MarkdownElement(markdownElement.name, 'markdown', data);
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
        expect(field.type).toEqual('color');
        expect(field.value).toEqual(rawField.value);
    });

    it(`Markdown element should be mapped to MarkdownElement`, () => {
        const field = item.markdown as MarkdownElement;
        const rawField = responseJson.items[0].elements.markdown;

        expect(field).toEqual(jasmine.any(MarkdownElement));

        expect(field.name).toEqual(rawField.name);
        expect(field.type).toEqual('markdown');
        expect(field.value).toEqual(rawField.value);
    });

});

