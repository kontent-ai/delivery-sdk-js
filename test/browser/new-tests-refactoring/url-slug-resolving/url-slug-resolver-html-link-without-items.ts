import {
    ContentItem,
    Elements,
    TypeResolver,
    Parse5RichTextParser,
    BrowserRichTextParser,
    IContentItemElements
} from '../../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './url-slug-resolver-html-link-without-items.json';

interface IFileElement extends IContentItemElements {
    text: Elements.RichTextElement;
}

class File extends ContentItem<IFileElement> {
    constructor() {
        super({
            urlSlugResolver: (link, context) => {
                return {
                    html: `<a href="${link.type}" download>${link.codename}</a>`
                };
            }
        });
    }
}

describe('Url slug resolver with html & without content items (browser)', () => {
    let item: File | undefined;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            projectId: '',
            typeResolvers: [new TypeResolver('file', (data) => new File())],
            richTextParserAdapter: new BrowserRichTextParser()
        })
            .item<IFileElement>('x')
            .toPromise();

        item = response.data.item;
    });

    it(`Links should be resolved in rich text`, () => {
        expect(item).toBeDefined();

        let resolvedHtml: string = '';

        if (item) {
            resolvedHtml = item.elements.text.resolveHtml();
        }

        expect(resolvedHtml).toContain('<a href="file" download="">kentico_cloud_logotype</a>');
        expect(resolvedHtml).toContain('<a href="file" download="">logo___powered_by_kentico_kontent_badge</a>');
        expect(resolvedHtml).toContain('<a href="file" download="">logo___kentico_kontent_partner_badges</a>');
    });
});

describe('Url slug resolver with html & without content items (parse5)', () => {
    let item: File | undefined;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            projectId: '',
            typeResolvers: [new TypeResolver('file', (data) => new File())],
            richTextParserAdapter: new Parse5RichTextParser()
        })
            .item<IFileElement>('x')
            .toPromise();

        item = response.data.item;
    });

    it(`Links should be resolved in rich text`, () => {
        expect(item).toBeDefined();

        let resolvedHtml: string = '';

        if (item) {
            resolvedHtml = item.elements.text.resolveHtml();
        }

        expect(resolvedHtml).toContain('<a href="file" download="">kentico_cloud_logotype</a>');
        expect(resolvedHtml).toContain('<a href="file" download="">logo___powered_by_kentico_kontent_badge</a>');
        expect(resolvedHtml).toContain('<a href="file" download="">logo___kentico_kontent_partner_badges</a>');
    });
});
