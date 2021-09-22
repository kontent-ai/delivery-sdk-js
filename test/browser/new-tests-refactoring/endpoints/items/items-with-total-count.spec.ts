import { IQueryParameter } from '@kentico/kontent-core';

import { ItemResponses } from '../../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './items-with-total-count.spec.json';

describe('Items with total count', () => {
    const context = new Context();
    setup(context);

    let response: ItemResponses.IListContentItemsResponse<any>;
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

    it(`Response should have total count parameter set`, () => {
        expect(response.pagination.totalCount).toEqual(responseJson.pagination.total_count);
    });
});
