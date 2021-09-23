import { IContentItem, ElementType, Elements } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './custom-element.spec.json';

interface ColorElementValue {
    red: number;
    green: number;
    blue: number;
}

interface MarkdownElementValue {
    isMarkdown: boolean;
}

describe('Custom element with custom model', () => {
    let item: IContentItem;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            projectId: '',
            elementResolver: (elementWrapper) => {
                const responseItem = responseJson.items[0];
                const colorElement = responseJson.items[0].elements.color;
                const markdownElement = responseJson.items[0].elements.markdown;

                if (
                    elementWrapper.system.type === responseItem.system.type &&
                    elementWrapper.rawElement.name === colorElement.name
                ) {
                    const parsed = JSON.parse(elementWrapper.rawElement.value);

                    return <ColorElementValue>{
                        red: parsed.red,
                        green: parsed.green,
                        blue: parsed.blue
                    };
                }

                if (
                    elementWrapper.system.type === responseItem.system.type &&
                    elementWrapper.rawElement.name === markdownElement.name
                ) {
                    return <MarkdownElementValue>{
                        isMarkdown: true
                    };
                }
                return undefined;
            }
        })
            .items()
            .toPromise();

        item = response.data.items[0];
    });

    it(`Color element should be mapped to ColorElement`, () => {
        const element = item.elements.color as Elements.ICustomElement<ColorElementValue>;
        const rawElement = responseJson.items[0].elements.color;


        expect(element.value.red).toEqual(167);
        expect(element.value.green).toEqual(96);
        expect(element.value.blue).toEqual(197);

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
    });

    it(`Markdown element should be mapped to MarkdownElement`, () => {
        const element = item.elements.markdown as Elements.ICustomElement<MarkdownElementValue>;
        const rawElement = responseJson.items[0].elements.markdown;

        expect(element.value.isMarkdown).toEqual(true);
        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
    });
});
