import { IQueryParameter } from '@kentico/kontent-core';

import { Responses } from '../../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './items-list-response.spec.json';

describe('Items list response', () => {
    const context = new Context();
    setup(context);

    let response: Responses.IListContentItemsResponse;
    const parameters: IQueryParameter[] = [];

    beforeAll(async () => {
        const query = getDeliveryClientWithJson(responseJson).items().includeTotalCountParameter();

        parameters.push(...query.getParameters());

        response = (await query.toPromise()).data;
    });

    it(`Total count parameter should be set to true`, () => {
        const totalCountParameter = parameters.find(
            (m) => m.getParam().toLowerCase() === 'includeTotalCount=true'.toLowerCase()
        );

        expect(totalCountParameter).toBeDefined();
    });

    it(`Response should have pagination`, () => {
        expect(response.pagination).toBeDefined();
    });

    it(`Response item should be mapped properly`, () => {
        const item = response.items[0];
        const rawItem = responseJson.items[0];

        expect(item).toBeDefined();
        expect(rawItem).toBeDefined();
        expect(item.system).toBeDefined();

        expect(item.elements.title.value).toEqual(rawItem.elements.title.value);
        expect(item.elements.summary.value).toEqual(rawItem.elements.summary.value);
        expect(item.elements.post_date.value).toEqual(new Date(rawItem.elements.post_date.value));
    });
});
