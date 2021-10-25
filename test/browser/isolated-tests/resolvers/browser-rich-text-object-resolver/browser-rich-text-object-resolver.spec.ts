import { getDeliveryClientWithJson, Movie } from '../../../setup';
import {
    Responses,
    linkedItemsHelper,
    browserRichTextObjectResolverExperimental,
    IRichTextObjectItem
} from '../../../../../lib';
import * as warriorJson from '../../fake-data/fake-warrior-response.json';
import * as expectedJson from './expected-result.json';

describe('Browser rich text object resolver', () => {
    let response: Responses.IViewContentItemResponse<Movie>;
    let resolvedRichText: IRichTextObjectItem;

    beforeAll(async () => {
        response = (await getDeliveryClientWithJson(warriorJson).item<Movie>('x').toPromise()).data;
        resolvedRichText = browserRichTextObjectResolverExperimental.resolveRichText({
            element: response.item.elements.plot,
            linkedItems: linkedItemsHelper.convertLinkedItemsToArray(response.linkedItems),
            removeSdkIds: true
        });
    });

    it(`verifies json structure`, () => {
        expect(JSON.stringify(resolvedRichText)).toEqual(JSON.stringify(expectedJson));
    });
});
