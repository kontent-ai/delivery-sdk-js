import { IQueryParameter } from '@kentico/kontent-core';

import { Responses } from '../../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './items-without-total-count.spec.json';

describe('Items without total count', () => {
    const context = new Context();
    setup(context);

    let response: Responses.IListContentItemsResponse<any>;
    const parameters: IQueryParameter[] = [];

    beforeAll(async () => {
        const query = getDeliveryClientWithJson(responseJson).items();

        parameters.push(...query.getParameters());

        response = (await query.toPromise()).data;
    });

    it(`Total count parameter should not be set`, () => {
        const totalCountParameter = parameters.find((m) =>
            m.getParam().toLowerCase().startsWith('includeTotalCount'.toLowerCase())
        );

        expect(totalCountParameter).toBeUndefined();
    });

    it(`Response should not have total count parameter set`, () => {
        expect(response.pagination.totalCount).toEqual(undefined);
    });
});
