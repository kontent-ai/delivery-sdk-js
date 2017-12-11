// setup
import { setup, Context, Movie, Actor } from '../../setup';

// models
import { Fields, ContentItemSystemAttributes, ILink } from '../../../lib';

// tests
describe('URLSlugField', () => {
    const sharedActor = new Actor();
    const actorId = '3294e4b0-e58b-49d7-85fa-5bc9a86556ec';
    sharedActor.system = new ContentItemSystemAttributes(actorId, 'Joel', 'joel', 'actor', new Date(), 'en', []);

    it(`checks that field is defined and correct`, () => {
        const field1 = new Fields.UrlSlugField('name', 'actor-slug', sharedActor, (link: ILink) => 'resolved-link/' + link.url_slug, true);
        expect(field1.getUrl()).toEqual('resolved-link/actor-slug');
        expect(field1.name).toBeDefined();
    });

    it(`checks that url slug is resolved #1`, () => {
    });

    it(`checks that url slug is resolved only for given type`, () => {
        const field = new Fields.UrlSlugField('name', 'actor-slug', sharedActor, (link: ILink) => {
            if (link.type === 'actor') {
                return 'actor-link/' + link.url_slug;
            }
            return 'unknown-link';
        }, true);
    });

    it(`checks that url slug is not resolved when the type is incorrect`, () => {
        const actor = new Actor();
        actor.system = new ContentItemSystemAttributes(actorId, 'Joel', 'joel', 'invalid_actor', new Date(), 'en', []);
        const field = new Fields.UrlSlugField('name', 'actor-slug', actor, (link: ILink) => {
            if (link.type === 'actor') {
                return 'actor-link/' + link.url_slug;
            }
            return 'unknown-link';
        }, true);
        expect(field.getUrl()).toEqual('unknown-link');
    });

    it(`url should be null when no resolver is passed`, () => {
        let url = 'test_url';
        url = (new Fields.UrlSlugField('name', 'actor-slug', sharedActor, null, true).getUrl());
        expect(url).toEqual(null);
    });

    it(`url should be null when invalid item is passed`, () => {
        let url = 'test_url';
        url = (new Fields.UrlSlugField('name', 'actor-slug', null, (link) => 'test', true).getUrl());
        expect(url).toEqual(null);
    });

    it(`url should be null when resolved url equals to null`, () => {
        let url = 'test_url';
        url = (new Fields.UrlSlugField('name', 'actor-slug', null, (link) => null, true).getUrl());
        expect(url).toEqual(null);
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

