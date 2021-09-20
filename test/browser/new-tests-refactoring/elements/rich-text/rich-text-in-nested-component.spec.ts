import {
    ContentItem,
    Elements,
    Parse5RichTextParser,
    TypeResolver,
    BrowserRichTextParser,
    IContentItemElements
} from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './rich-text-in-nested-component.spec.json';

interface IMainElements extends IContentItemElements {
    maintext: Elements.RichTextElement;
}

class Main extends ContentItem<IMainElements> {
    constructor() {
        super();
    }
}

interface IItemElements extends IContentItemElements {
    text: Elements.RichTextElement;
}

class Item extends ContentItem<IItemElements> {
    constructor() {
        super({
            richTextResolver: (item: Item) => {
                return `<div>${item.elements.text.resolveHtml()}</div>`;
            }
        });
    }
}

describe('Rich text resolving in nested component (Browser)', () => {
    let item: ContentItem<any>;

    beforeAll(async () => {
        const response = (
            await getDeliveryClientWithJson(responseJson, {
                projectId: '',
                typeResolvers: [
                    new TypeResolver('main', (data) => new Main()),
                    new TypeResolver('item', (data) => new Item())
                ],
                richTextParserAdapter: new BrowserRichTextParser()
            })
                .item<any>('x')
                .toPromise()
        ).data;

        item = response.item;
    });

    it(`Rich text resolving succeeds`, () => {
        expect(item).toBeDefined();
        const resolvedHtml = item.elements.maintext.resolveHtml();
        expect(resolvedHtml).toBeDefined();
    });
});

describe('Rich text resolving in nested component (Parse5)', () => {
    let item: ContentItem<any>;

    beforeAll(async () => {
        const response = (
            await getDeliveryClientWithJson(responseJson, {
                projectId: '',
                typeResolvers: [
                    new TypeResolver('main', (data) => new Main()),
                    new TypeResolver('item', (data) => new Item())
                ],
                richTextParserAdapter: new Parse5RichTextParser()
            })
                .item<any>('x')
                .toPromise()
        ).data;

        item = response.item;
    });

    it(`Rich text resolving succeeds`, () => {
        expect(item).toBeDefined();

        const resolvedHtml = item.elements.maintext.resolveHtml();
        expect(resolvedHtml).toBeDefined();
    });
});
