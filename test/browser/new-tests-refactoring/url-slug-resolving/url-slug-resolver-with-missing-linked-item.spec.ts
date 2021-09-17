import { ContentItem, Elements, TypeResolver } from '../../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './url-slug-resolver-with-missing-linked-item.spec.json';

export class Page extends ContentItem {
    public body!: Elements.RichTextElement;

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
    let page: Page | undefined;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            projectId: '',
            typeResolvers: [new TypeResolver('page', (data) => new Page())]
        })
            .item<Page>('x')
            .toPromise();

        page = response.data.item;
    });

    it(`Links should be resolved in rich text`, () => {
        expect(page).toBeDefined();

        let resolvedHtml: string = '';

        if (page) {
            resolvedHtml = page.body.resolveHtml();
        }

        expect(resolvedHtml).toContain('myLink/spiral_evaluation_form_imperial');
        expect(resolvedHtml).toContain('myLink/industries');
    });
});
