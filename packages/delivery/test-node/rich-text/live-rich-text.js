const assert = require('assert');
const KenticoCloud = require('../../_commonjs');

class Actor extends KenticoCloud.ContentItem {

    constructor() {
        super({
            richTextResolver: (item) => {
                return `<p>${item.first_name.text}</p>`;
            },
            linkResolver: (link) => {
                return '/actor/' + link.urlSlug;
            }
        });
    }
}

class Movie extends KenticoCloud.ContentItem {

    constructor() {
        super({
            propertyResolver: (fieldName) => {
                if (fieldName === 'releasecategory') {
                    return 'releaseCategory';
                }
            },
            richTextResolver: (item) => {
                return `<p>${item.title.text}</p>`;
            },
            linkResolver: (link) => {
                return 'testSlugUrl/' + link.urlSlug;
            }
        }, );
    }
}

const movieCodename = 'warrior';
const classA = 'classA';
const classB = 'classB';
const richTextWrapper = 'rich-text-wrapper';

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9',
    typeResolvers: [
        new KenticoCloud.TypeResolver('movie', () => new Movie()),
        new KenticoCloud.TypeResolver('actor', () => new Actor())
    ],
    linkedItemResolver: {
        linkedItemWrapperTag: richTextWrapper,
        linkedItemWrapperClasses: [classA, classB]
    }
});

describe('#Rich text field', () => {

    let result;
    let plot; // resolved plot (rich text)

    const expectedHtmlA = `<p>Joel</p>`;
    const expectedHtmlB = `<p>Tom</p>`;

    const expectedLinkA = '/actor/joel-edgerton';
    const expectedLinkB = '/actor/tom-hardy';

    before((done) => {
        deliveryClient.item(movieCodename)
        .getObservable()
            .subscribe(response => {
                result = response;

                plot = response.item.plot.getHtml();
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

    it('Rich text should field should contain class A', () => {
        assert.ok(plot.includes(classA));
    });

    it('Rich text should field should contain class B', () => {
        assert.ok(plot.includes(classB));
    });

    it('Rich text should field should contain tag wrapper', () => {
        assert.ok(plot.includes('<' + richTextWrapper));
    });
});
