import { getDeliveryClientWithJson } from '../../setup';

import { BrowserRichTextParser, ContentItem, Elements, TypeResolver, Parse5RichTextParser } from '../../../../../lib';
import * as responseJson from './rich-text-with-advanced-tables.spec.json';

class AdvancedTable extends ContentItem {
    public rich_text!: Elements.RichTextElement;

    constructor() {
        super({
            urlSlugResolver: (link, context) => {
                return {
                    html: `<span>${link.codename}</span>`
                };
            }
        });
    }
}

class LinkType1 extends ContentItem {
    constructor() {
        super({
            urlSlugResolver: (link, context) => {
                return {
                    html: `<link1>${link.codename}</link1>`
                };
            }
        });
    }
}

class LinkType2 extends ContentItem {
    constructor() {
        super({
            urlSlugResolver: (link, context) => {
                return {
                    html: `<link2>${link.codename}</link2>`
                };
            }
        });
    }
}

class LinkType3 extends ContentItem {
    constructor() {
        super({
            urlSlugResolver: (link, context) => {
                return {
                    html: `<link3>${link.codename}</link3>`
                };
            }
        });
    }
}

const expectedResolvedContent: string[] = [
    `<link1>paper_filters_for_chemex</link1>`,
    `<link2>test_tables</link2>`,
    `<link3>which_brewing_fits_you_</link3>`
];

describe('Rich text with advanced tables (parse5)', () => {
    let item: AdvancedTable;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            projectId: '',
            typeResolvers: [
                new TypeResolver('advanced_table', (data) => new AdvancedTable()),
                new TypeResolver('link_type_1', (data) => new LinkType1()),
                new TypeResolver('link_type_2', (data) => new LinkType2()),
                new TypeResolver('link_type_3', (data) => new LinkType3())
            ],
            richTextParserAdapter: new Parse5RichTextParser()
        })
            .item<AdvancedTable>('x')
            .toPromise();

        item = response.item;
    });

    it(`Links should be resolved in rich text`, () => {
        expect(item).toBeDefined();
        const resolvedHtml = item.rich_text.resolveHtml();

        for (const expectedContent of expectedResolvedContent) {
            expect(resolvedHtml).toContain(expectedContent);
        }
    });
});

describe('Rich text with advanced tables (browser)', () => {
    let item: AdvancedTable;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            projectId: '',
            typeResolvers: [
                new TypeResolver('advanced_table', (data) => new AdvancedTable()),
                new TypeResolver('link_type_1', (data) => new LinkType1()),
                new TypeResolver('link_type_2', (data) => new LinkType2()),
                new TypeResolver('link_type_3', (data) => new LinkType3())
            ],
            richTextParserAdapter: new BrowserRichTextParser()
        })
            .item<AdvancedTable>('x')
            .toPromise();

        item = response.item;
    });

    it(`Links should be resolved in rich text`, () => {
        expect(item).toBeDefined();
        const resolvedHtml = item.rich_text.resolveHtml();

        for (const expectedContent of expectedResolvedContent) {
            expect(resolvedHtml).toContain(expectedContent);
        }
    });
});
