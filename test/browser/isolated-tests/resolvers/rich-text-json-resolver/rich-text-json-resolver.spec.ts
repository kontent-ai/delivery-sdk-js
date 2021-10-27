import { getDeliveryClientWithJson, Movie } from '../../../setup';
import {
    Responses,
    linkedItemsHelper,
    createRichTextJsonResolver,
    IRichTextJsonResult
} from '../../../../../lib';
import * as warriorJson from '../../fake-data/fake-warrior-response.json';
import * as expectedJson from './expected-result.json';

describe('Rich text json resolver', () => {
    let response: Responses.IViewContentItemResponse<Movie>;
    let resolvedRichText: IRichTextJsonResult;

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(warriorJson).item<Movie>('x').toPromise()).data;
        resolvedRichText = createRichTextJsonResolver().resolveRichText({
            element: response.item.elements.plot,
            linkedItems: linkedItemsHelper.convertLinkedItemsToArray(response.linkedItems),
            cleanSdkIds: true
        });
    });

    it(`verifies json structure`, () => {
        expect(resolvedRichText.json).toEqual(JSON.stringify(expectedJson));
    });
});
