import { ContentItemSystemAttributes, ElementModels, Elements, urlSlugResolver } from '../../../lib';
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

    it(`value should be raw (unresolved) value of element`, () => {
        const urlSlugElement = new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                enableAdvancedLogging: false,
                item: sharedActor,
                elementValue: 'actor-slug',
                elementName: 'name',
                resolver: (link, context) => {
                    return {
                        url: 'resolved-link/' + link.urlSlug
                    };
                }
            }).url || ''
        });
        expect(urlSlugElement.value).toEqual('actor-slug');
    });

    it(`checks that element is defined and correct`, () => {
        const element1 = new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                enableAdvancedLogging: false,
                item: sharedActor,
                elementValue: 'actor-slug',
                elementName: 'name',
                resolver: (link, context) => { return { url: 'resolved-link/' + link.urlSlug } }
            }).url || ''
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
                    resolver: (link, context) => {
                        if (link.type === 'actor') {
                            return { url: 'actor-link/' + link.urlSlug };
                        }
                        return { url: 'unknown-link' };
                    }
                }).url || ''
            });

        expect(element.resolveUrl()).toEqual('unknown-link');
    });

    it(`url should be empty string`, () => {
        const url = (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: sharedActor,
                enableAdvancedLogging: false,
                resolver: (link, context) => undefined
            }).url || ''
        })).resolveUrl();

        expect(url).toEqual('');
    });

    it(`Checks that console.warn displays/not displays information when url resolving fails due to invalid resolver`, () => {
        console.warn = jasmine.createSpy('warn');

        (new Elements.UrlSlugElement(elementMapWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementValue: 'actor-slug',
                elementName: 'name',
                item: sharedActor,
                enableAdvancedLogging: true,
                resolver: (link, context) => undefined
            }).url || ''
        })).resolveUrl();

        expect(console.warn).toHaveBeenCalledTimes(1);
    });
});

