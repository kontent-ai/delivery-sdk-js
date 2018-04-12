const KenticoCloud = require('../../../_commonjs');

class Actor extends KenticoCloud.ContentItem {

    constructor() {
        super({
            richTextResolver: (item) => {
                console.log('RICH ITEM:');
                console.log(item);
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
    modularContentResolver: {
        modularContentWrapperTag: richTextWrapper,
        modularContentWrapperClasses: [classA, classB]
    }
});

deliveryClient.item(movieCodename)
    .getObservable()
    .subscribe(response => {
        const expectedHtmlA = `<p>Joel</p>`;
        const expectedHtmlB = `<p>Tom</p>`;

        const expectedLinkA = '/actor/joel-edgerton';
        const expectedLinkB = '/actor/tom-hardy';

        // check if plot contains resolved rich text items
        const plot = response.item.plot.getHtml();

        if (!plot.includes(expectedHtmlA)) {
            throw Error('Rich text should contain: ' + expectedHtmlA);
        }

        if (!plot.includes(expectedHtmlB)) {
            throw Error('Rich text should contain: ' + expectedHtmlB);
        }

        if (!plot.includes(expectedLinkA)) {
            throw Error('Rich text should contain link: ' + expectedLinkA);
        }

        if (!plot.includes(expectedLinkB)) {
            throw Error('Rich text should contain link: ' + expectedLinkB);
        }

        if (!plot.includes(classB)) {
            throw Error('Rich text should contain class: ' + classB);
        }

        if (!plot.includes(classA)) {
            throw Error('Rich text should contain class: ' + classA);
        }

        if (!plot.includes('<' + richTextWrapper)) {
            throw Error('Rich text should contain wrapper: ' + richTextWrapper);
        }

        console.log('Rich text tests are all ok');
    });
