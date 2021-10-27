import { getDeliveryClientWithJson, Movie } from '../../../setup';
import {
    Responses,
    linkedItemsHelper,
    createRichTextObjectResolver,
    IRichTextObjectResult
} from '../../../../../lib';
import * as warriorJson from '../../fake-data/fake-warrior-response.json';
import * as expectedJson from './expected-result.json';

describe('Rich text object resolver', () => {
    let response: Responses.IViewContentItemResponse<Movie>;
    let resolvedRichText: IRichTextObjectResult;

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(warriorJson).item<Movie>('x').toPromise()).data;
        resolvedRichText = createRichTextObjectResolver().resolveRichText({
            element: response.item.elements.plot,
            linkedItems: linkedItemsHelper.convertLinkedItemsToArray(response.linkedItems),
            cleanSdkIds: true
        });
    });

    it(`verifies json structure`, () => {
        expect(JSON.stringify(resolvedRichText.data)).toEqual(JSON.stringify(expectedJson));
    });
});
