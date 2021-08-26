import { ContentItem, Elements, Parse5RichTextParser, TypeResolver, BrowserRichTextParser } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './rich-text-in-nested-component.spec.json';

class Main extends ContentItem {
    public maintext!: Elements.RichTextElement;

    constructor() {
        super();
    }
}

class Item extends ContentItem {
    public text!: Elements.RichTextElement;

    constructor() {
        super({
            richTextResolver: (item: Item) => {
                return `<div>${item.text.resolveHtml()}</div>`;
            }
        });
    }
}

describe('Rich text resolving in nested component (Browser)', () => {
    let item: Main;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson, {
            projectId: '',
            typeResolvers: [
                new TypeResolver('main', (data) => new Main()),
                new TypeResolver('item', (data) => new Item())
            ],
            richTextParserAdapter: new BrowserRichTextParser()
        })
            .item<Main>('x')
            .toObservable()
            .subscribe((result) => {
                item = result.item;
                done();
            });
    });

    it(`Rich text resolving succeeds`, () => {
        expect(item).toBeDefined();
        const resolvedHtml = item.maintext.resolveHtml();
        expect(resolvedHtml).toBeDefined();
    });
});

describe('Rich text resolving in nested component (Parse5)', () => {
    let item: Main;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson, {
            projectId: '',
            typeResolvers: [
                new TypeResolver('main', (data) => new Main()),
                new TypeResolver('item', (data) => new Item())
            ],
            richTextParserAdapter: new Parse5RichTextParser()
        })
            .item<Main>('x')
            .toObservable()
            .subscribe((result) => {
                item = result.item;
                done();
            });
    });

    it(`Rich text resolving succeeds`, () => {
        expect(item).toBeDefined();

        const resolvedHtml = item.maintext.resolveHtml();
        expect(resolvedHtml).toBeDefined();
    });
});
