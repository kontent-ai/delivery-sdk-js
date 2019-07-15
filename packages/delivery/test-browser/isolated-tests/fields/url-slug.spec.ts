import { ContentItemSystemAttributes, Elements, Link, urlSlugResolver, ElementModels } from '../../../lib';
import { Actor } from '../../setup';

describe('URLSlugElement', () => {
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

    const elementMapWrapper: ElementModels.IElementWrapper = {
        contentTypeSystem: {} as any,
        propertyName: 'name',
        rawElement: {
            name: 'name',
            type: 'x',
            value: 'actor-slug'
        }
    };

    it(`checks that element is defined and correct`, () => {
        const element1 = new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                enableAdvancedLogging: false,
                item: sharedActor,
                elementValue: 'actor-slug',
                elementName: 'name',
                linkResolver: (link: Link) => 'resolved-link/' + link.urlSlug
            })
        });
        expect(element1.resolveUrl()).toEqual('resolved-link/actor-slug');
        expect(element1.name).toBeDefined();
    });

    it(`checks that url slug is not resolved when the type is incorrect`, () => {
        const actor = new Actor();

        actor.system = new ContentItemSystemAttributes({
            id: actorId,
            codename: 'invalid_actor',
            name: 'Joel',
            type: 'invalid',
            language: 'en',
            lastModified: new Date(),
            sitemapLocations: []
        });

        const element = new Elements.UrlSlugElement({
            contentTypeSystem: {} as any,
            propertyName: 'name',
            rawElement: {
                name: 'name',
                type: 'x',
                value: 'actor-slug'
            }
        }, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: actor,
                enableAdvancedLogging: false,
                linkResolver: (link: Link) => {
                    if (link.type === 'actor') {
                        return 'actor-link/' + link.urlSlug;
                    }
                    return 'unknown-link';
                }
            })
        });

        expect(element.resolveUrl()).toEqual('unknown-link');
    });

    it(`url should be undefined when no resolver is passed`, () => {
        const url = (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: sharedActor,
                enableAdvancedLogging: false,
                linkResolver: undefined
            })
        })).resolveUrl();
        expect(url).toBeUndefined();
    });

    it(`url should be undefined when invalid item is passed`, () => {
        const url = (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: undefined as any,
                enableAdvancedLogging: false,
                linkResolver: undefined
            })
        })).resolveUrl();
        expect(url).toBeUndefined();
    });

    it(`url should be undefined`, () => {
        const url = (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: sharedActor,
                enableAdvancedLogging: false,
                linkResolver: () => undefined as any
            })
        })).resolveUrl();
        expect(url).toBeUndefined();
    });

    it(`Checks that console.warn displays/not displays information when url resolving fails due to invalid resolver`, () => {
        console.warn = jasmine.createSpy('warn');

       (new Elements.UrlSlugElement(elementMapWrapper, {
        resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: sharedActor,
                enableAdvancedLogging: false,
                linkResolver: () => undefined as any
            })
        })).resolveUrl();

        expect(console.warn).toHaveBeenCalledTimes(0);

         (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: sharedActor,
                enableAdvancedLogging: true,
                linkResolver: () => undefined as any
            })
        })).resolveUrl();

        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it(`Checks that console.warn displays/not displays information when url resolving fails due to invalid item`, () => {
        console.warn = jasmine.createSpy('warn');

        (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: undefined as any,
                enableAdvancedLogging: false,
                linkResolver: () => undefined as any
            })
        })).resolveUrl();

        expect(console.warn).toHaveBeenCalledTimes(0);

        (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: undefined as any,
                enableAdvancedLogging: true,
                linkResolver: () => undefined as any
            })
        })).resolveUrl();

        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it(`Checks that console.warn displays information that url was resolved to improper value`, () => {
        console.warn = jasmine.createSpy('warn');

        (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: sharedActor,
                enableAdvancedLogging: false,
                linkResolver: () => 'test'
            })
        })).resolveUrl();

        expect(console.warn).toHaveBeenCalledTimes(0);

        (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: sharedActor,
                enableAdvancedLogging: true,
                linkResolver: () => ''
            })
        })).resolveUrl();

        expect(console.warn).toHaveBeenCalledTimes(1);

    });

});

