import { HttpService } from '@kentico/kontent-core';

import { ItemResponses, sdkInfo } from '../../../../lib';
import { Actor, Context, IMovieElements, MockQueryService, setup } from '../../setup';
import * as warriorJson from '../fake-data/fake-warrior-response.json';

describe('Verifies mapping of delivery content item', () => {
    const context = new Context();
    setup(context);

    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    let response: ItemResponses.ViewContentItemResponse<IMovieElements>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<IMovieElements>(warriorJson, {});
        done();
    });

    it(`checks system codename`, () => {
        expect(response.item.system.codename).toEqual(warriorJson.item.system.codename);
    });

    it(`checks system id`, () => {
        expect(response.item.system.id).toEqual(warriorJson.item.system.id);
    });

    it(`checks system type`, () => {
        expect(response.item.system.type).toEqual(warriorJson.item.system.type);
    });

    it(`checks system collection`, () => {
        expect(response.item.system.collection).toEqual(warriorJson.item.system.collection);
    });

    it(`checks last modified`, () => {
        expect(response.item.system.lastModified).toEqual(jasmine.any(Date));
        expect(response.item.system.lastModified).toEqual(new Date(warriorJson.item.system.last_modified));
    });

    it(`checks workflow step`, () => {
        expect(response.item.system.workflowStep).toEqual(warriorJson.item.system.workflow_step);
    });

    it(`checks language`, () => {
        expect(response.item.system.language).toEqual(warriorJson.item.system.language);
    });

    it(`checks site map locations`, () => {
        const locations: string[] = ['main_sitemap'];
        expect(response.item.system.sitemapLocations).toEqual(locations);
    });

    it(`checks taxonomy element`, () => {
        expect(response.item.elements.releaseCategory.value[0].codename).toEqual(
            warriorJson.item.elements.releasecategory.value[0].codename
        );
    });

    it(`checks text element`, () => {
        expect(response.item.elements.title.value).toEqual(warriorJson.item.elements.title.value);
    });

    it(`checks datetime element`, () => {
        expect(response.item.elements.released.value).toEqual(new Date(warriorJson.item.elements.released.value));
    });

    it(`checks number element`, () => {
        expect(response.item.elements.length.value).toEqual(warriorJson.item.elements.length.value);
    });

    it(`checks url slug element`, () => {
        expect(response.item.elements.seoname.resolveUrl()).toEqual(
            `testSlugUrl/${warriorJson.item.elements.seoname.value}`
        );
    });

    it(`checks assets element`, () => {
        expect(response.item.elements.poster.value.length).toEqual(warriorJson.item.elements.poster.value.length);
        expect(response.item.elements.poster.value[0].url).toEqual(warriorJson.item.elements.poster.value[0].url);
    });

    it(`checks that linked items are defined`, () => {
        expect(response.item.elements.stars).toBeDefined();
    });

    it(`checks that correct number of linked items are created`, () => {
        expect(response.item.elements.stars.value.length).toEqual(warriorJson.item.elements.stars.value.length);
    });

    it(`checks that linked items are of proper type`, () => {
        expect(response.item.elements.stars.value[0]).toEqual(jasmine.any(Actor));
    });

    it(`checks that text element in first linked item is set`, () => {
        expect(
            response.item.elements.stars.value.find(
                (m) =>
                    m.elements.firstName.value === warriorJson.modular_content.joel_edgerton.elements.first_name.value
            )
        ).toBeDefined();
    });

    it(`checks that text element in second linked item is set`, () => {
        expect(
            response.item.elements.stars.value.find(
                (m) => m.elements.firstName.value === warriorJson.modular_content.tom_hardy.elements.first_name.value
            )
        ).toBeDefined();
    });
});
