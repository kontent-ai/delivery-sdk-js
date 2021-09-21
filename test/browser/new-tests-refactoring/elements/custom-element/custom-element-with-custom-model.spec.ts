import { IContentItem, ElementModels, Elements, ElementType } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './custom-element.spec.json';

class ColorElement extends Elements.CustomElement {
    public red: number;
    public green: number;
    public blue: number;

    constructor(public element: ElementModels.IElementWrapper) {
        super(element);

        const parsed = JSON.parse(element.rawElement.value);
        this.red = parsed.red;
        this.green = parsed.green;
        this.blue = parsed.blue;
    }
}

class MarkdownElement extends Elements.CustomElement {
    public isMarkdown = true;

    constructor(public element: ElementModels.IElementWrapper) {
        super(element);
    }
}

describe('Custom element with custom model', () => {
    let item: IContentItem<any>;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            projectId: '',
            elementResolver: (elementWrapper) => {
                const responseItem = responseJson.items[0];
                const colorElement = responseJson.items[0].elements.color;
                const markdownElement = responseJson.items[0].elements.markdown;

                if (
                    elementWrapper.contentItemSystem.type === responseItem.system.type &&
                    elementWrapper.rawElement.name === colorElement.name
                ) {
                    return new ColorElement(elementWrapper);
                }

                if (
                    elementWrapper.contentItemSystem.type === responseItem.system.type &&
                    elementWrapper.rawElement.name === markdownElement.name
                ) {
                    return new MarkdownElement(elementWrapper);
                }
                return undefined;
            }
        })
            .items()
            .toPromise();

        item = response.data.items[0];
    });

    it(`Color element should be mapped to ColorElement`, () => {
        const element = item.elements.color as ColorElement;
        const rawElement = responseJson.items[0].elements.color;

        expect(element).toEqual(jasmine.any(ColorElement));

        expect(element.red).toEqual(167);
        expect(element.green).toEqual(96);
        expect(element.blue).toEqual(197);

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
        expect(element.value).toEqual(rawElement.value);
    });

    it(`Markdown element should be mapped to MarkdownElement`, () => {
        const element = item.elements.markdown as MarkdownElement;
        const rawElement = responseJson.items[0].elements.markdown;

        expect(element).toEqual(jasmine.any(MarkdownElement));

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
        expect(element.value).toEqual(rawElement.value);
    });
});
