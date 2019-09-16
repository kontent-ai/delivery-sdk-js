import { ItemResponses, sdkInfo } from '../../../lib';
import { Actor, Context, MockQueryService, Movie, setup, warriorMovieJson } from '../../setup';
import { HttpService } from '@kentico/kontent-core';

describe('Verifies mapping of delivery content item', () => {

    const context = new Context();
    setup(context);

    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    let response: ItemResponses.ViewContentItemResponse<Movie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<Movie>(warriorMovieJson, {});
        done();
    });

    it(`checks system codename`, () => {
        expect(response.item.system.codename).toEqual('warrior');
    });

    it(`checks system id`, () => {
        expect(response.item.system.id).toEqual('325e2acb-1c14-47f6-af9a-27bc8b6c16fe');
    });

    it(`checks system type`, () => {
        expect(response.item.system.type).toEqual('movie');
    });

    it(`checks last modified`, () => {
        expect(response.item.system.lastModified).toEqual(jasmine.any(Date));
        expect(response.item.system.lastModified).toEqual(new Date('2017-06-21T12:22:09.1437891Z'));
    });

    it(`checks language`, () => {
        expect(response.item.system.language).toEqual('en');
    });

    it(`checks site map locations`, () => {
        const locations: string[] = [
            'main_sitemap'
        ];
        expect(response.item.system.sitemapLocations).toEqual(locations);
    });

    it(`checks taxonomy element`, () => {
        expect(response.item.releaseCategory.value[0].codename).toEqual('global_release');
    });

    it(`checks text element`, () => {
        expect(response.item.title.value).toEqual('Warrior');
    });

    it(`checks datetime element`, () => {
        expect(response.item.released.value).toEqual(new Date('2011-09-09T00:00:00Z'));
    });

    it(`checks number element`, () => {
        expect(response.item.length.value).toEqual(151);
    });

    it(`checks url slug element`, () => {
        expect(response.item.seoname.resolveUrl()).toEqual('testSlugUrl/warrior');
    });

    it(`checks assets element`, () => {
        expect(response.item.stars.value.length).toEqual(2);
    });

    it(`checks that linked items are defined`, () => {
        expect(response.item.stars).toBeDefined();
    });

    it(`checks that correct number of linked items are created`, () => {
        expect(response.item.stars.value.length).toEqual(2);
    });

    it(`checks that linked items are of proper type`, () => {
        expect(response.item.stars.value[0]).toEqual(jasmine.any(Actor));
    });

    it(`checks that text element in first linked item is set`, () => {
        expect(response.item.stars.value[0].firstName.value).toEqual('Tom');
    });

    it(`checks that text element in second linked item is set`, () => {
        expect(response.item.stars.value[1].firstName.value).toEqual('Joel');
    });
});

