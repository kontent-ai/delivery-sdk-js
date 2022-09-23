import { Responses, Elements, ElementType, IContentItem } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './rich-text.spec.json';

describe('Rich-text element', () => {
    let response: Responses.IListContentItemsResponse;
    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(responseJson).items().toPromise()).data;
    });

    it(`Rich-text linked items should be re-ordered if not ordered in raw response`, async () => {
        const rawItem = responseJson.items.find(({ system: { codename } }) => codename === 'rich_text_item_unordered');
        const item = response.items.find(
            ({ system: { codename } }) => codename === 'rich_text_item_unordered'
        ) as IContentItem;
        const element = item.elements.rich as Elements.RichTextElement;

        expect(element.type).toEqual(ElementType.RichText);
        expect(rawItem?.elements.rich.modular_content).toEqual(['n2', 'n4', 'n3', 'n1']);
        expect(element.linkedItemCodenames).toEqual(['n1', 'n2', 'n3', 'n4']);
        for (const i = 0; i < element.linkedItems.length; ++i) {
            expect(element.linkedItems[i].system.codename).toBe(`n${i + 1}`);
        }
    });

    it(`Rich-text linked items order should be maintained if already ordered in raw response`, () => {
        const rawItem = responseJson.items.find(({ system: { codename } }) => codename === 'rich_text_item_ordered');
        const item = response.items.find(
            ({ system: { codename } }) => codename === 'rich_text_item_ordered'
        ) as IContentItem;
        const element = item.elements.rich as Elements.RichTextElement;

        expect(element.type).toEqual(ElementType.RichText);
        expect(rawItem?.elements.rich.modular_content).toEqual(['n1', 'n2', 'n3', 'n4']);
        expect(element.linkedItemCodenames).toEqual(['n1', 'n2', 'n3', 'n4']);
        for (const i = 0; i < element.linkedItems.length; ++i) {
            expect(element.linkedItems[i].system.codename).toBe(`n${i + 1}`);
        }
    });
});
