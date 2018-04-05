import { ContentItemSystemAttributes, Fields, Link } from '../../../lib';
import { Actor } from '../../setup';

describe('URLSlugField', () => {
    const sharedActor = new Actor();
    const actorId = '3294e4b0-e58b-49d7-85fa-5bc9a86556ec';
    sharedActor.system = new ContentItemSystemAttributes({
        id: actorId,
        codename: 'joel',
        name: 'Joel',
        type: 'actor',
        language: 'en',
        lastModified: new Date(),
        sitemapLocations: []
    });

    it(`checks that field is defined and correct`, () => {
        const field1 = new Fields.UrlSlugField('name', 'actor-slug', sharedActor, (link: Link) => 'resolved-link/' + link.urlSlug, true);
        expect(field1.getUrl()).toEqual('resolved-link/actor-slug');
        expect(field1.name).toBeDefined();
    });

    it(`checks that url slug is not resolved when the type is incorrect`, () => {
        const actor = new Actor();

        actor.system = new ContentItemSystemAttributes({
            id: actorId,
            codename: 'invalid_actor',
            name: 'Joel',
            type: 'actor',
            language: 'en',
            lastModified: new Date(),
            sitemapLocations: []
        });

        const field = new Fields.UrlSlugField('name', 'actor-slug', actor, (link: Link) => {
            if (link.type === 'actor') {
                return 'actor-link/' + link.urlSlug;
            }
            return 'unknown-link';
        }, true);
        expect(field.getUrl()).toEqual('unknown-link');
    });

    it(`url should be undefined when no resolver is passed`, () => {
        let url = 'test_url';
        url = (new Fields.UrlSlugField('name', 'actor-slug', sharedActor, null, true).getUrl());
        expect(url).toBeUndefined();
    });

    it(`url should be undefined when invalid item is passed`, () => {
        let url = 'test_url';
        url = (new Fields.UrlSlugField('name', 'actor-slug', null, (link) => 'test', true).getUrl());
        expect(url).toBeUndefined();
    });

    it(`url should be undefined`, () => {
        let url = 'test_url';
        url = (new Fields.UrlSlugField('name', 'actor-slug', null, (link) => null, true).getUrl());
        expect(url).toBeUndefined();
    });

    it(`Checks that console.warn displays/not displays information when url resolving fails due to invalid resolver`, () => {
        console.warn = jasmine.createSpy('warn');

        new Fields.UrlSlugField('name', 'actor-slug', sharedActor, null, false).getUrl();
        expect(console.warn).toHaveBeenCalledTimes(0);

        new Fields.UrlSlugField('name', 'actor-slug', sharedActor, null, true).getUrl();
        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it(`Checks that console.warn displays/not displays information when url resolving fails due to invalid item`, () => {
        console.warn = jasmine.createSpy('warn');

        (new Fields.UrlSlugField('name', 'actor-slug', null, (link) => 'test', false).getUrl());
        expect(console.warn).toHaveBeenCalledTimes(0);

        new Fields.UrlSlugField('name', 'actor-slug', null, (link) => 'test', true).getUrl();
        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it(`Checks that console.warn displays information that url was resolved to improper value`, () => {
        console.warn = jasmine.createSpy('warn');

        new Fields.UrlSlugField('name', 'actor-slug', sharedActor, (link) => 'test', false).getUrl();
        expect(console.warn).toHaveBeenCalledTimes(0);

        new Fields.UrlSlugField('name', 'actor-slug', sharedActor, (link) => '', false).getUrl();
        expect(console.warn).toHaveBeenCalledTimes(1);

    });

});

