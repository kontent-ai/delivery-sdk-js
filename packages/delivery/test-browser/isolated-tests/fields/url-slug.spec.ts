import { ContentItemSystemAttributes, Fields, Link, urlSlugResolver } from '../../../lib';
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
        const field1 = new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                enableAdvancedLogging: false,
                item: sharedActor,
                fieldValue: 'actor-slug',
                type: 'actor_type',
                fieldName: 'name',
                linkResolver: (link: Link) => 'resolved-link/' + link.urlSlug
            })
        });
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

        const field = new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: actor,
                enableAdvancedLogging: false,
                type: 'actor-type',
                linkResolver: (link: Link) => {
                    if (link.type === 'actor') {
                        return 'actor-link/' + link.urlSlug;
                    }
                    return 'unknown-link';
                }
            })
        });

        expect(field.getUrl()).toEqual('unknown-link');
    });

    it(`url should be undefined when no resolver is passed`, () => {
        const url = (new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: sharedActor,
                enableAdvancedLogging: false,
                type: 'actor-type',
                linkResolver: undefined
            })
        })).getUrl();
        expect(url).toBeUndefined();
    });

    it(`url should be undefined when invalid item is passed`, () => {
        const url = (new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: undefined as any,
                enableAdvancedLogging: false,
                type: 'actor-type',
                linkResolver: undefined
            })
        })).getUrl();
        expect(url).toBeUndefined();
    });

    it(`url should be undefined`, () => {
        const url = (new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: sharedActor,
                enableAdvancedLogging: false,
                type: 'actor-type',
                linkResolver: () => undefined as any
            })
        })).getUrl();
        expect(url).toBeUndefined();
    });

    it(`Checks that console.warn displays/not displays information when url resolving fails due to invalid resolver`, () => {
        console.warn = jasmine.createSpy('warn');

       (new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: sharedActor,
                enableAdvancedLogging: false,
                type: 'actor-type',
                linkResolver: () => undefined as any
            })
        })).getUrl();

        expect(console.warn).toHaveBeenCalledTimes(0);

         (new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: sharedActor,
                enableAdvancedLogging: true,
                type: 'actor-type',
                linkResolver: () => undefined as any
            })
        })).getUrl();

        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it(`Checks that console.warn displays/not displays information when url resolving fails due to invalid item`, () => {
        console.warn = jasmine.createSpy('warn');

        (new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: undefined as any,
                enableAdvancedLogging: false,
                type: 'actor-type',
                linkResolver: () => undefined as any
            })
        })).getUrl();

        expect(console.warn).toHaveBeenCalledTimes(0);

        (new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: undefined as any,
                enableAdvancedLogging: true,
                type: 'actor-type',
                linkResolver: () => undefined as any
            })
        })).getUrl();

        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it(`Checks that console.warn displays information that url was resolved to improper value`, () => {
        console.warn = jasmine.createSpy('warn');

        (new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: sharedActor,
                enableAdvancedLogging: false,
                type: 'actor-type',
                linkResolver: () => 'test'
            })
        })).getUrl();

        expect(console.warn).toHaveBeenCalledTimes(0);

        (new Fields.UrlSlugField('name', 'actor-slug', {
            resolveUrl: () => urlSlugResolver.resolveUrl({
                fieldValue: 'actor-slug',
                fieldName: 'name',
                item: sharedActor,
                enableAdvancedLogging: true,
                type: 'actor-type',
                linkResolver: () => ''
            })
        })).getUrl();

        expect(console.warn).toHaveBeenCalledTimes(1);

    });

});

