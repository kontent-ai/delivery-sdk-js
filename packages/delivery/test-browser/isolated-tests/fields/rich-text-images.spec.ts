import {
    Fields,
    getParserAdapter,
    IDeliveryClientConfig,
    ImageUrlBuilder,
    RichTextImage,
    richTextResolver,
    TypeResolver,
} from '../../../lib';

describe('RichTextField with Images', () => {
    const config: IDeliveryClientConfig = {
        projectId: 'xxx',
        typeResolvers: []
    };

    // prepare images
    const images: RichTextImage[] = [
        new RichTextImage({
            imageId: 'image1',
            url: 'www.domain.com/image1.png',
            description: undefined,
            height: 99,
            width: 88

        }),
        new RichTextImage({
            imageId: 'image2',
            url: 'www.domain.com/image2.png',
            description: undefined,
            height: 12,
            width: 11
        })
    ];

    const image1 = images[0];
    const image2 = images[1];

    const image1Html = getImageHtml('assetId1', image1.imageId, image1.url, image1.description);
    const image2Html = getImageHtml('assetId2', image2.imageId, image2.url, image2.description);

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
            images: images
        });

        const expectedHtml1 = image1Html;
        const expectedHtml2 = image2Html;

        const resultHtml = field.getHtml();

        expect(resultHtml).toContain(expectedHtml1);
        expect(resultHtml).toContain(expectedHtml2);
    });

    it(`Checks that images are resolved using custom resolver`, () => {
        const field2 = new Fields.RichTextField('name', html, [], {
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
                    }),
                },
            }),
            images: images
        });

        const expectedHtml1 = getImageSrcHtml(image1.url + '?xParam=xValue');
        const expectedHtml2 = getImageSrcHtml(image2.url + '?xParam=xValue');

        const resultHtml = field2.getHtml();

        expect(resultHtml).toContain(expectedHtml1);
        expect(resultHtml).toContain(expectedHtml2);
    });

    function getImageSrcHtml(imageUrl: string): string {
        return `src="${imageUrl}"`;
    }

    function getImageHtml(assetId: string, imageId: string, imageUrl: string, description?: string): string {
        return `<figure data-asset-id="${assetId}" data-image-id="${imageId}"><img src="${imageUrl}" data-asset-id="${assetId}" data-image-id="${imageId}" alt="${description ? description : ''}"></figure>`;
    }
});

