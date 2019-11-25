import { IQueryParameter } from '@kentico/kontent-core';

import { ItemResponses } from '../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './items-with-total-count.spec.json';

describe('Items with total count', () => {
    const context = new Context();
    setup(context);

    let response: ItemResponses.ListContentItemsResponse;
    const parameters: IQueryParameter[] = [];

    beforeAll(done => {
        const query = getDeliveryClientWithJson(responseJson)
            .items()
            .includeTotalCountParameter();

        parameters.push(...query.getParameters());

        query.toObservable().subscribe(result => {
            response = result;
            done();
        });
    });

    it(`Total count parameter should be set to true`, () => {
        const totalCountParameter = parameters.find(
            m => m.getParam().toLowerCase() === 'includeTotalCount'.toLowerCase()
        );

        expect(totalCountParameter).toBeDefined();

        if (totalCountParameter) {
            expect(totalCountParameter.getParamValue()).toEqual('true');
        }
    });

    it(`Response should be of proper type`, () => {
        expect(response).toEqual(jasmine.any(ItemResponses.ListContentItemsResponse));
    });

    it(`Response should have total count parameter set`, () => {
        expect(response.pagination.totalCount).toEqual(responseJson.pagination.total_count);
    });
});
