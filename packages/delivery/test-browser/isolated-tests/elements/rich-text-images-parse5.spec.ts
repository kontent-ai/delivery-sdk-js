import {
    ContentItem,
    ContentItemSystemAttributes,
    Elements,
    ImageUrlBuilder,
    RichTextImage,
    richTextResolver,
} from '../../../lib';
import { Parse5RichTextParser } from '../../../lib/parser/adapters/parse5-rich-text.parser';

describe('RichTextElement with Images parse5', () => {
    const linkedItemCodename = 'xLinkedItemCodename';

    const linkedItem = new ContentItem();
    linkedItem.system = new ContentItemSystemAttributes({
        codename: linkedItemCodename,
        id: 'x',
        language: 'en',
        lastModified: new Date(),
        name: 'x linked item',
        sitemapLocations: [],
        type: 'article'
    });

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

    // set images to rich text
    linkedItem['name'] = new Elements.RichTextElement(
        {
            contentItemSystem: {} as any,
            propertyName: 'name',
            rawElement: {
                name: 'name',
                type: 'x',
                value: ''
            }
        },
        [],
        {
            images: images,
            links: [],
            resolveRichTextFunc: () => ({
                html: '',
                componentCodenames: [],
                linkedItemCodenames: []
            })
        }
    );

    const image1 = images[0];
    const image2 = images[1];

    const image1Html = getImageHtml('assetId1', image1.imageId, image1.url, image1.description);
    const image2Html = getImageHtml('assetId2', image2.imageId, image2.url, image2.description);

    const html = `
    Testing html with images. ${image1Html} and ${image2Html}`;

    it(`Checks that images are resolved using default resolver`, () => {
        const element = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'name',
                rawElement: {
                    name: 'name',
                    type: 'x',
                    value: html
                }
            },
            [],
            {
                links: [],
                resolveRichTextFunc: () =>
                    richTextResolver.resolveHtml(linkedItemCodename, html, 'name', {
                        enableAdvancedLogging: false,
                        links: [],
                        getLinkedItem: codename => linkedItem,
                        images: images,
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: [],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextImageResolver: undefined
                        }
                    }),
                images: images
            }
        );

        const expectedHtml1 = image1Html;
        const expectedHtml2 = image2Html;

        const resultHtml = element.resolveHtml();

        expect(resultHtml).toContain(expectedHtml1);
        expect(resultHtml).toContain(expectedHtml2);
    });

    it(`Checks that images are resolved using custom resolver`, () => {
        const element2 = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'name',
                rawElement: {
                    name: 'name',
                    type: 'x',
                    value: html
                }
            },
            [],
            {
                links: [],
                resolveRichTextFunc: () =>
                    richTextResolver.resolveHtml(linkedItemCodename, html, 'name', {
                        enableAdvancedLogging: false,
                        links: [],
                        getLinkedItem: codename => linkedItem,
                        images: images,
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: [],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextImageResolver: (image, elementName) => {
                                const newImageUrl = new ImageUrlBuilder(image.url)
                                    .withCustomParam('xParam', 'xValue')
                                    .getUrl();
                                return {
                                    url: newImageUrl
                                };
                            }
                        }
                    }),
                images: images
            }
        );

        const expectedHtml1 = getImageSrcHtml(image1.url + '?xParam=xValue');
        const expectedHtml2 = getImageSrcHtml(image2.url + '?xParam=xValue');

        const resultHtml = element2.resolveHtml();

        expect(resultHtml).toContain(expectedHtml1);
        expect(resultHtml).toContain(expectedHtml2);
    });

    function getImageSrcHtml(imageUrl: string): string {
        return `src="${imageUrl}"`;
    }

    function getImageHtml(assetId: string, imageId: string, imageUrl: string, description?: string): string {
        return `<figure data-asset-id="${assetId}" data-image-id="${imageId}"><img src="${imageUrl}" data-asset-id="${assetId}" data-image-id="${imageId}" alt="${
            description ? description : ''
        }"></figure>`;
    }
});
