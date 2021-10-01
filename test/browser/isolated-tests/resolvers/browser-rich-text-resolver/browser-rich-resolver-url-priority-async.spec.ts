import { Actor, getDeliveryClientWithJson, Movie, toPromise } from '../../../setup';
import { browserRichTextResolver, IResolvedRichTextHtmlResult, Responses, linkedItemsHelper } from '../../../../../lib';
import * as warriorJson from '../../fake-data/fake-warrior-response.json';

const expectedHtml = `<p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>
<p>Stars:&nbsp;</p>
<div data-sdk-resolved="1" data-sdk-item-index="0"><div class="xClass">Tom</div></div>
<div data-sdk-resolved="1" data-sdk-item-index="1"><div class="xClass">Joel</div></div>
<p><br></p>
<p>See more in profile of <a data-item-id="3294e4b0-e58b-49d7-85fa-5bc9a86556ec" href="xLinkUrl-joel-edgerton">Joel Edgerton</a> and <a data-item-id="d1557cb1-d7ec-4d04-9742-f86b52bc34fc" href="xLinkUrl-tom-hardy">Tom Hardy</a></p>
<p>And here are some images:&nbsp;</p>
<figure data-asset-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" data-image-id="22504ba8-2075-48fa-9d4f-8fce3de1754a"><img src="xImageUrl-22504ba8-2075-48fa-9d4f-8fce3de1754a" data-asset-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" data-image-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" alt=""></figure>
<figure data-asset-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-image-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5"><img src="xImageUrl-bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-asset-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-image-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" alt=""></figure>
<p><br></p>
<p>Also, why not include content component in the mix?</p>
<div data-sdk-resolved="1" data-sdk-item-index="2"><div class="xClass">Jennifer </div></div>`;

describe('Browser rich text resolver (URL priority) async', () => {
    let response: Responses.IViewContentItemResponse<Movie>;
    let resolvedRichText: IResolvedRichTextHtmlResult;

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(warriorJson).item<Movie>('x').toPromise()).data;
        resolvedRichText = await browserRichTextResolver.resolveRichTextAsync({
            element: response.item.elements.plot,
            linkedItems: linkedItemsHelper.convertLinkedItemsToArray(response.linkedItems),
            imageResolver: async (image) => {
                return await toPromise({
                    imageUrl: `xImageUrl-${image?.imageId}`
                });
            },
            urlResolver: async (link) => {
                return await toPromise({
                    linkUrl: `xLinkUrl-${link?.link?.urlSlug}`
                });
            },
            contentItemResolver: async (contentItem) => {
                if (contentItem && contentItem.system.type === 'actor') {
                    const actor = contentItem as Actor;
                    return {
                        contentItemHtml: `<div class="xClass">${actor.elements.firstName.value}</div>`
                    };
                }

                return {
                    contentItemHtml: ''
                };
            }
        });
    });

    it(`linked items html should match expected result`, () => {
        expect(resolvedRichText.html).toEqual(expectedHtml);
    });

    it(`links should be resolved`, () => {
        expect(resolvedRichText.html).toContain('<a data-item-id="3294e4b0-e58b-49d7-85fa-5bc9a86556ec" href="xLinkUrl-joel-edgerton">Joel Edgerton</a>');
        expect(resolvedRichText.html).toContain('<a data-item-id="d1557cb1-d7ec-4d04-9742-f86b52bc34fc" href="xLinkUrl-tom-hardy">Tom Hardy</a>');
    });

    it(`images should be resolved`, () => {
        expect(resolvedRichText.html).toContain('<img src="xImageUrl-22504ba8-2075-48fa-9d4f-8fce3de1754a" data-asset-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" data-image-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" alt="">');
        expect(resolvedRichText.html).toContain('<img src="xImageUrl-bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-asset-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-image-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" alt="">');
    });

    it(`linked items should be resolved`, () => {
        expect(resolvedRichText.html).toContain('<div class="xClass">Joel</div>');
        expect(resolvedRichText.html).toContain('<div class="xClass">Tom</div>');
    });

    it(`component codenames should be set`, () => {
        expect(resolvedRichText.componentCodenames).toEqual(['ec9813f6_194d_018f_e20c_36855fb6e600']);
    });

    it(`linked item codenames should be set`, () => {
        expect(resolvedRichText.linkedItemCodenames).toEqual(['tom_hardy', 'joel_edgerton']);
    });
});
