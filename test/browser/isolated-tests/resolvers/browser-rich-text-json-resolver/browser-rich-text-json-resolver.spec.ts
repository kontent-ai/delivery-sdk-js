import { getDeliveryClientWithJson, Movie } from '../../../setup';
import {
    Responses,
    linkedItemsHelper,
    browserRichTextJsonResolverExperimental,
    IRichTextJsonResult
} from '../../../../../lib';
import * as warriorJson from '../../fake-data/fake-warrior-response.json';
import * as expectedJson from './expected-result.json';

describe('Browser rich text json resolver', () => {
    let response: Responses.IViewContentItemResponse<Movie>;
    let resolvedRichText: IRichTextJsonResult;

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(warriorJson).item<Movie>('x').toPromise()).data;
        resolvedRichText = browserRichTextJsonResolverExperimental.resolveRichText({
            element: response.item.elements.plot,
            linkedItems: linkedItemsHelper.convertLinkedItemsToArray(response.linkedItems),
            removeSdkIds: true
        });
    });

    it(`verifies json structure`, () => {
        expect(resolvedRichText.json).toEqual(JSON.stringify(expectedJson));
    });
});
