import { ContentItem, Elements, IContentItem, IContentItemElements, TypeResolver } from '../../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './url-slug-resolver-with-missing-linked-item.spec.json';

interface IPageElements extends IContentItemElements {
    text: Elements.RichTextElement;
    body: Elements.RichTextElement;
}

export class Page extends ContentItem<IPageElements> {
    constructor() {
        super({
            urlSlugResolver: (link, context) => {
                return {
                    url: 'myLink/' + link.codename
                };
            }
        });
    }
}

describe('Url slug resolver with missing linked item', () => {
    let page: IContentItem<IPageElements>;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            projectId: '',
            typeResolvers: [new TypeResolver('page', (data) => new Page())]
        })
            .item<IPageElements>('x')
            .toPromise();

        page = response.data.item;
    });

    it(`Links should be resolved in rich text`, () => {
        expect(page).toBeDefined();

        let resolvedHtml: string = '';

        if (page) {
            resolvedHtml = page.elements.body.resolveHtml();
        }

        expect(resolvedHtml).toContain('myLink/spiral_evaluation_form_imperial');
        expect(resolvedHtml).toContain('myLink/industries');
    });
});
