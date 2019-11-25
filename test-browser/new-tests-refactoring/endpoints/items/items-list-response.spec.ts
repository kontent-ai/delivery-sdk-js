import { IQueryParameter } from '@kentico/kontent-core';

import { ItemResponses, Pagination, ContentItem, ContentItemSystemAttributes, Elements } from '../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './items-list-response.spec.json';

describe('Items list response', () => {
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

    it(`Response should have pagination`, () => {
        expect(response.pagination).toEqual(jasmine.any(Pagination));
    });

    it(`getAllElements should return proper array of elements`, () => {
        const item = response.items[0];
        const rawItem = responseJson.items[0];

        expect(item).toBeDefined();
        expect(rawItem).toBeDefined();

        const rawElementsArray = Object.values(rawItem.elements);

        const elements = item.getAllElements();

        expect(elements.length).toEqual(rawElementsArray.length);

        for (const element of elements) {
            expect(element).toEqual(jasmine.any(Elements.BaseElement));
        }
    });

    it(`Response item should be mapped properly`, () => {
        const item = response.items[0];
        const rawItem = responseJson.items[0];

        expect(item).toBeDefined();
        expect(rawItem).toBeDefined();
        expect(item).toEqual(jasmine.any(ContentItem));
        expect(item.system).toEqual(jasmine.any(ContentItemSystemAttributes));

        expect(item.title.value).toEqual(rawItem.elements.title.value);
        expect(item.summary.value).toEqual(rawItem.elements.summary.value);
        expect(item.post_date.value).toEqual(new Date(rawItem.elements.post_date.value));
    });
});
