import { Actor, getDeliveryClientWithJson, Movie } from '../../../setup';
import {
    richTextHtmlResolver,
    IResolvedRichTextHtmlResult,
    Responses,
    linkedItemsHelper
} from '../../../../../lib';
import * as warriorJson from '../../fake-data/fake-warrior-response.json';

const expectedHtml = `<p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>
<p>Stars:&nbsp;</p>
<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="tom_hardy"><div class="xClass">Tom</div></object>
<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="joel_edgerton"><div class="xClass">Joel</div></object>
<p><br></p>
<p>See more in profile of <a data-item-id="3294e4b0-e58b-49d7-85fa-5bc9a86556ec" href="xLinkUrl-joel-edgerton">Joel Edgerton</a> and <a data-item-id="d1557cb1-d7ec-4d04-9742-f86b52bc34fc" href="xLinkUrl-tom-hardy">Tom Hardy</a></p>
<p>And here are some images:&nbsp;</p>
<figure data-asset-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" data-image-id="22504ba8-2075-48fa-9d4f-8fce3de1754a"><img src="xImageUrl-22504ba8-2075-48fa-9d4f-8fce3de1754a" data-asset-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" data-image-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" alt=""></figure>
<figure data-asset-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-image-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5"><img src="xImageUrl-bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-asset-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-image-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" alt=""></figure>
<p><br></p>
<p>Also, why not include content component in the mix?</p>
<object type="application/kenticocloud" data-type="item" data-rel="component" data-codename="ec9813f6_194d_018f_e20c_36855fb6e600"><div class="xClass">Jennifer </div></object>`;

describe('Rich text resolver (URL priority)', () => {
    let response: Responses.IViewContentItemResponse<Movie>;
    let resolvedRichText: IResolvedRichTextHtmlResult;

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(warriorJson).item<Movie>('x').toPromise()).data;
        resolvedRichText = richTextHtmlResolver.resolveRichText({
            element: response.item.elements.plot,
            linkedItems: linkedItemsHelper.convertLinkedItemsToArray(response.linkedItems),
            imageResolver: (imageId, image) => {
                return {
                    imageUrl: `xImageUrl-${image?.imageId}`
                };
            },
            urlResolver: (linkId, linkText, link) => {
                return {
                    linkUrl: `xLinkUrl-${link?.urlSlug}`
                };
            },
            contentItemResolver: (contentItemId, contentItem) => {
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
        expect(resolvedRichText.html).toContain(
            '<a data-item-id="3294e4b0-e58b-49d7-85fa-5bc9a86556ec" href="xLinkUrl-joel-edgerton">Joel Edgerton</a>'
        );
        expect(resolvedRichText.html).toContain(
            '<a data-item-id="d1557cb1-d7ec-4d04-9742-f86b52bc34fc" href="xLinkUrl-tom-hardy">Tom Hardy</a>'
        );
    });

    it(`images should be resolved`, () => {
        expect(resolvedRichText.html).toContain(
            '<img src="xImageUrl-22504ba8-2075-48fa-9d4f-8fce3de1754a" data-asset-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" data-image-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" alt="">'
        );
        expect(resolvedRichText.html).toContain(
            '<img src="xImageUrl-bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-asset-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-image-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" alt="">'
        );
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
