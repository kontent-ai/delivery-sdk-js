import { ItemResponses, sdkInfo } from '../../../lib';
import { Actor, Context, MockQueryService, Movie, setup, warriorMovieJson } from '../../setup';
import { HttpService } from 'kentico-cloud-core';

describe('Verifies mapping of delivery content item', () => {

    const context = new Context();
    setup(context);

    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    let response: ItemResponses.DeliveryItemResponse<Movie>;

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

    it(`checks taxonomy field`, () => {
        expect(response.item.releaseCategory.taxonomyTerms[0].codename).toEqual('global_release');
    });

    it(`checks text field`, () => {
        expect(response.item.title.text).toEqual('Warrior');
    });

    it(`checks datetime field`, () => {
        expect(response.item.released.datetime).toEqual(new Date('2011-09-09T00:00:00Z'));
    });

    it(`checks Nunmber field`, () => {
        expect(response.item.length.number).toEqual(151);
    });

    it(`checks url slug field`, () => {
        expect(response.item.seoname.getUrl()).toEqual('testSlugUrl/warrior');
    });

    it(`checks assets field`, () => {
        expect(response.item.stars.length).toEqual(2);
    });

    it(`checks that linked items are defined`, () => {
        expect(response.item.stars).toBeDefined();
    });

    it(`checks that correct number of linked items are created`, () => {
        expect(response.item.stars.length).toEqual(2);
    });

    it(`checks that linked items are of proper type`, () => {
        expect(response.item.stars[0]).toEqual(jasmine.any(Actor));
    });

    it(`checks that text field in first linked item is set`, () => {
        expect(response.item.stars[0].firstName.text).toEqual('Tom');
    });

    it(`checks that text field in second linked item is set`, () => {
        expect(response.item.stars[1].firstName.text).toEqual('Joel');
    });
});

