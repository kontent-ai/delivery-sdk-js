import {
    createAsyncRichTextHtmlResolver,
    IResolvedRichTextHtmlResult,
    linkedItemsHelper,
    Responses
} from '../../../../../lib';
import { Actor, getDeliveryClientWithJson, Movie, toPromise } from '../../../setup';
import * as warriorJson from '../../fake-data/fake-warrior-response.json';

const expectedHtml = `<p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>
<p>Stars:&nbsp;</p>
<div class="xClass">Tom</div>
<div class="xClass">Joel</div>
<p><br></p>
<p>See more in profile of <a class="xLink">joel-edgerton</a> and <a class="xLink">tom-hardy</a></p>
<p>And here are some images:&nbsp;</p>
<figure data-asset-id="22504ba8-2075-48fa-9d4f-8fce3de1754a" data-image-id="22504ba8-2075-48fa-9d4f-8fce3de1754a"><img class="xImage" src="22504ba8-2075-48fa-9d4f-8fce3de1754a"></figure>
<figure data-asset-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5" data-image-id="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5"><img class="xImage" src="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5"></figure>
<p><br></p>
<p>Also, why not include content component in the mix?</p>
<div class="xClass">Jennifer </div>`;

describe('Rich text resolver (HTML priority) async', () => {
    let response: Responses.IViewContentItemResponse<Movie>;
    let resolvedRichText: IResolvedRichTextHtmlResult;

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(warriorJson).item<Movie>('x').toPromise()).data;
        resolvedRichText = await createAsyncRichTextHtmlResolver().resolveRichTextAsync({
            element: response.item.elements.plot,
            linkedItems: linkedItemsHelper.convertLinkedItemsToArray(response.linkedItems),
            imageResolverAsync: async (imageId, image) => {
                return await toPromise({
                    imageHtml: `<img class="xImage" src="${image?.imageId}">`
                });
            },
            urlResolverAsync: async (linkId, linkText, link) => {
                return await toPromise({
                    linkHtml: `<a class="xLink">${link?.urlSlug}</a>`
                });
            },
            contentItemResolverAsync: async (itemId, contentItem) => {
                if (contentItem && contentItem.system.type === 'actor') {
                    const actor = contentItem as Actor;
                    return await toPromise({
                        contentItemHtml: `<div class="xClass">${actor.elements.first_name.value}</div>`
                    });
                }

                return await toPromise({
                    contentItemHtml: ''
                });
            }
        });
    });

    it(`linked items html should match expected result`, () => {
        expect(resolvedRichText.html).toEqual(expectedHtml);
    });

    it(`links should be resolved`, () => {
        expect(resolvedRichText.html).toContain('<a class="xLink">tom-hardy</a>');
        expect(resolvedRichText.html).toContain('<a class="xLink">joel-edgerton</a>');
    });

    it(`images should be resolved`, () => {
        expect(resolvedRichText.html).toContain('<img class="xImage" src="22504ba8-2075-48fa-9d4f-8fce3de1754a">');
        expect(resolvedRichText.html).toContain('<img class="xImage" src="bb0899cf-2c3a-4e3f-8962-60e5a54fcca5">');
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
