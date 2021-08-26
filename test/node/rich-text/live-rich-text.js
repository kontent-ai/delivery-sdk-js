const assert = require('assert');
const KontentDelivery = require('../../../dist/cjs');

class Actor extends KontentDelivery.ContentItem {

    constructor() {
        super({
            richTextResolver: (item, context) => {
                return `<p>${item.first_name.value}</p>`;
            },
            urlSlugResolver: (link) => {
                return { url: '/actor/' + link.urlSlug };
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
            richTextResolver: (item, context) => {
                return `<p>${item.title.value}</p>`;
            },
            urlSlugResolver: (link, context) => {
                return { url: 'testSlugUrl/' + link.urlSlug };
            }
        }, );
    }
}

const movieCodename = 'warrior';
const classA = 'classA';
const classB = 'classB';
const richTextWrapper = 'rich-text-wrapper';

const deliveryClient = new KontentDelivery.DeliveryClient({
    projectId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9',
    typeResolvers: [
        new KontentDelivery.TypeResolver('movie', () => new Movie()),
        new KontentDelivery.TypeResolver('actor', () => new Actor())
    ],
    linkedItemResolver: {
        linkedItemWrapperTag: richTextWrapper,
        linkedItemWrapperClasses: [classA, classB]
    }
});

describe('#Rich text element', () => {

    let result;
    let plot; // resolved plot (rich text)

    const expectedHtmlA = `<p>Joel</p>`;
    const expectedHtmlB = `<p>Tom</p>`;

    const expectedLinkA = '/actor/joel-edgerton';
    const expectedLinkB = '/actor/tom-hardy';

    before((done) => {
        deliveryClient.item(movieCodename)
        .toObservable()
            .subscribe(response => {
                result = response;

                plot = response.item.plot.resolveHtml();
                done();
            });
    });

    it('Rich text should contain expected HTML A', () => {
        assert.ok(plot.includes(expectedHtmlA));
    });

    it('Rich text should contain expected HTML B', () => {
        assert.ok(plot.includes(expectedHtmlB));
    });

    it('Rich text should contain expected resolved link A', () => {
        assert.ok(plot.includes(expectedLinkA));
    });

    it('Rich text should contain expected resolved link B', () => {
        assert.ok(plot.includes(expectedLinkB));
    });

    it('Rich text should element should contain class A', () => {
        assert.ok(plot.includes(classA));
    });

    it('Rich text should element should contain class B', () => {
        assert.ok(plot.includes(classB));
    });

    it('Rich text should element should contain tag wrapper', () => {
        assert.ok(plot.includes('<' + richTextWrapper));
    });
});
