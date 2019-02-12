import {
    ContentItem,
    ContentItemSystemAttributes,
    Fields,
    IDeliveryClientConfig,
    Link,
    richTextResolver,
    TypeResolver,
    urlSlugResolver,
    getParserAdapter,
    ILinkResolverResult,
    RichTextImage,
    ImageUrlBuilder
} from '../../../lib';

class ActorMock extends ContentItem {
    firstName!: Fields.TextField;
    system!: ContentItemSystemAttributes;
    url!: Fields.UrlSlugField;

    constructor() {
        super();
    }

    setProperties(id: string, codename: string, firstName: string) {
        this.firstName = new Fields.TextField('firstName', firstName);
        this.system = new ContentItemSystemAttributes({
            id: id,
            name: 'name',
            codename: codename,
            type: 'actor',
            sitemapLocations: [],
            language: 'en',
            lastModified: new Date()
        });

        this.url = new Fields.UrlSlugField('name', codename, {
            resolveLink: () => urlSlugResolver.resolveUrl({
                fieldName: 'name',
                type: 'type',
                item: this,
                linkResolver: (link: Link) => <ILinkResolverResult>{
                    asHtml: `<test>${link.urlSlug}</test>`,
                },
                enableAdvancedLogging: true,
                fieldValue: codename
            })
        });
    }
}

describe('RichTextField with Images', () => {
    // prepare config & type resolver
    const typeResolvers: TypeResolver[] = [
        new TypeResolver('actor', () => new ActorMock())
    ];

    const config: IDeliveryClientConfig = {
        projectId: '',
        typeResolvers: typeResolvers
    };

    // prepare images
    const images: RichTextImage[] = [
        new RichTextImage({
            imageId: '14mio',
            url: 'www.domain.com/image1.png'
        }),
        new RichTextImage({
            imageId: 'image2',
            url: 'www.domain.com/image2.png'
        })
    ];

    const image1 = images[0];
    const image2 = images[1];

    const image1Html = getImageHtml(image1.imageId, image1.url, image1.description);
    const image2Html = getImageHtml(image2.imageId, image2.url, image2.description);

    const html = `
    Testing html with images. ${image1Html} and ${image2Html}`;

    it(`Checks that images are resolved using default resolver`, () => {
        const field = new Fields.RichTextField('name', html, [], {
            links: [],
            resolveHtml: () => richTextResolver.resolveHtml(html, 'name', {
                enableAdvancedLogging: false,
                links: [],
                getLinkedItem: (codename) => undefined,
                typeResolvers: config.typeResolvers as TypeResolver[],
                images: images,
                richTextHtmlParser: getParserAdapter(),
                linkedItemWrapperClasses: [],
                linkedItemWrapperTag: 'kc-item-wrapper',
                queryConfig: {
                    richTextImageResolver: undefined
                },
            }),
            images: []
        });

        const expectedHtml1 = image1Html;
        const expectedHtml2 = image2Html;

        const resultHtml = field.getHtml();

        expect(resultHtml).toContain(expectedHtml1);
        expect(resultHtml).toContain(expectedHtml2);
    });

    it(`Checks that images are resolved using custom resolver`, () => {
        const field = new Fields.RichTextField('name', html, [], {
            links: [],
            resolveHtml: () => richTextResolver.resolveHtml(html, 'name', {
                enableAdvancedLogging: false,
                links: [],
                getLinkedItem: (codename) => undefined,
                typeResolvers: config.typeResolvers as TypeResolver[],
                images: images,
                richTextHtmlParser: getParserAdapter(),
                linkedItemWrapperClasses: [],
                linkedItemWrapperTag: 'kc-item-wrapper',
                queryConfig: {
                    richTextImageResolver: ((image, fieldName) => {

                        const newImageUrl = new ImageUrlBuilder(image.url)
                            .withCustomParam('xParam', 'xValue')
                            .getUrl();

                        return {
                            url: newImageUrl
                        };
                    })
                },
            }),
            images: []
        });

        const expectedHtml1 = getImageHtml(image1.imageId, image1.url + '?xParam=xValue', image1.description);
        const expectedHtml2 = getImageHtml(image2.imageId, image2.url + '?xParam=xValue', image2.description);

        const resultHtml = field.getHtml();

        expect(resultHtml).toContain(expectedHtml1);
        expect(resultHtml).toContain(expectedHtml2);
    });

    function getImageHtml(imageId: string, imageUrl: string, description?: string): string {
        return `<figure data-image-id=\"${imageId}\"><img src=\"${imageUrl}" alt=\"${description}\" data-image-id=\"${imageId}\"></figure>`;
    }
});

