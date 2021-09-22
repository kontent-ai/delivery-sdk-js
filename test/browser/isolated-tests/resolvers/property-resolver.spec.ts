import {  Elements, IContentItem, ItemResponses, sdkInfo } from '../../../../lib';
import { Context, MockQueryService, setup } from '../../setup';
import { HttpService } from '@kentico/kontent-core';
import * as warriorJson from '../fake-data/fake-warrior-response.json';

type MockMovie = IContentItem<{
    titleTest: Elements.ITextElement;
    test_released: Elements.IDateTimeElement;
    justNumber: Elements.INumberElement;
}>;

describe('Property resolver', () => {
    const context = new Context();

    context.propertyNameResolver = (contentType, element) => {
        if (element === 'title') {
            return 'titleTest';
        }
        if (element === 'released') {
            return 'test_released';
        }
        if (element === 'length') {
            return 'justNumber';
        }
        return element;
    };
    setup(context);

    // mock query service
    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    let response: ItemResponses.IViewContentItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorJson, {});
        console.log('TEST', response);
        done();
    });

    it(`checks element is assigned #1`, () => {
        expect(response.item.elements.titleTest.value).toEqual('Warrior');
    });

    it(`checks element is assigned #2`, () => {
        expect(response.item.elements.test_released.value).toEqual(new Date('2011-09-09T00:00:00Z'));
    });

    it(`checks element is assigned #3`, () => {
        expect(response.item.elements.justNumber.value).toEqual(151);
    });
});
