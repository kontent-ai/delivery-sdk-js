import { IContentItem, ElementType, Elements } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './custom-element.spec.json';


type ColorElement = Elements.CustomElement<{
    red: number;
    green: number;
    blue: number;
}>;

type MarkdownElement = Elements.CustomElement<{
    isMarkdown: boolean;

}>;

type ItemWithCustomElements = IContentItem<{
    color: ColorElement;
    markdown: MarkdownElement;
}>;

describe('Custom element with custom model', () => {
    let item: ItemWithCustomElements;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            environmentId: '',
            elementResolver: (elementWrapper) => {
                const responseItem = responseJson.items[0];
                const colorElement = responseJson.items[0].elements.color;
                const markdownElement = responseJson.items[0].elements.markdown;

                if (
                    elementWrapper.system.type === responseItem.system.type &&
                    elementWrapper.rawElement.name === colorElement.name
                ) {
                    const parsed = JSON.parse(elementWrapper.rawElement.value);

                    return {
                        red: parsed.red,
                        green: parsed.green,
                        blue: parsed.blue
                    };
                }

                if (
                    elementWrapper.system.type === responseItem.system.type &&
                    elementWrapper.rawElement.name === markdownElement.name
                ) {
                    return {
                        isMarkdown: true
                    };
                }
                return undefined;
            }
        })
            .items<ItemWithCustomElements>()
            .toPromise();

        item = response.data.items[0];
    });

    it(`Color element should be mapped to ColorElement`, () => {
        const element = item.elements.color;
        const rawElement = responseJson.items[0].elements.color;

        expect(element.value.red).toEqual(167);
        expect(element.value.green).toEqual(96);
        expect(element.value.blue).toEqual(197);

        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
    });

    it(`Markdown element should be mapped to MarkdownElement`, () => {
        const element = item.elements.markdown;
        const rawElement = responseJson.items[0].elements.markdown;

        expect(element.value.isMarkdown).toEqual(true);
        expect(element.name).toEqual(rawElement.name);
        expect(element.type).toEqual(ElementType.Custom);
    });
});
