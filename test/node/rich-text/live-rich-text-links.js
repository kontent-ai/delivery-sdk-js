const assert = require('assert');
const KontentDelivery = require('../../../dist/cjs');

const linkContexts = {};

class Actor extends KontentDelivery.ContentItem {

    constructor() {
        super({
            richTextResolver: (item, context) => {
                return `<p>${item.elements.first_name.value}</p>`;
            },
            urlSlugResolver: (link, context) => {
                linkContexts[link.codename] = context;
                return {
                    html: `<test>${link.urlSlug}</test>`
                }
            }
        });
    }
}

class Movie extends KontentDelivery.ContentItem {

    constructor() {
        super({
            propertyResolver: (elementName) => {
                if (elementName === 'releasecategory') {
                    return 'releaseCategory';
                }
            },
            urlSlugResolver: (item, context) => {
                return { url: `<p>${item.elements.title.value}</p>` };
            }
        });
    }
}

const movieCodename = 'warrior';

const deliveryClient = new KontentDelivery.DeliveryClient({
    projectId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9',
    typeResolvers: [
        new KontentDelivery.TypeResolver('movie', () => new Movie()),
        new KontentDelivery.TypeResolver('actor', () => new Actor())
    ],
});

describe('#Rich text element with HTML links', () => {

    let plot; // resolved plot (rich text)

    const expectedLinkHtmlA = `<test>joel-edgerton</test>`;
    const expectedLinkHtmlB = `<test>tom-hardy</test>`;

    before(async () => {
        const response = (await deliveryClient.item(movieCodename)
            .toPromise()).data;

        result = response;
        plot = response.item.elements.plot.resolveHtml();
    });

    it('Rich text should contain expected resolved HTML link A', () => {
        assert.ok(plot.includes(expectedLinkHtmlA));
    });

    it('Rich text should contain expected resolved HTML link B', () => {
        assert.ok(plot.includes(expectedLinkHtmlB));
    });

    it('Links in rich text should have context along with original link text', () => {
        assert.ok(plot.includes(expectedLinkHtmlB));

        const joelLink = linkContexts['joel_edgerton'];
        const tomLink = linkContexts['tom_hardy'];

        assert.ok(joelLink);
        if (joelLink) {
            assert.strictEqual(joelLink.linkText, 'Joel Edgerton');
        }

        assert.ok(tomLink);
        if (tomLink) {
            assert.strictEqual(tomLink.linkText, 'Tom Hardy');
        }
    });

});
