// setup
import { setup, Context, Movie, Actor } from '../../setup';

// models
import { Fields, ContentItemSystemAttributes, ILink } from '../../../lib';

// tests
describe('URLSlugField', () => {
    var actor = new Actor();
    var actorId = '3294e4b0-e58b-49d7-85fa-5bc9a86556ec';
    actor.system = new ContentItemSystemAttributes(actorId, 'Joel', 'joel', 'actor', new Date(), 'en', []);

    it(`checks that field is defined and correct`, () => {
        var field1 = new Fields.UrlSlugField('name', 'actor-slug', actor, (link: ILink) => 'resolved-link/' + link.url_slug, true);
        expect(field1.getUrl()).toEqual('resolved-link/actor-slug');
        expect(field1.name).toBeDefined();
    });

    it(`checks that url slug is resolved #1`, () => {
    });

    it(`checks that url slug is resolved only for given type`, () => {
        var field = new Fields.UrlSlugField('name', 'actor-slug', actor, (link: ILink) => {
            if (link.type === 'actor') {
                return 'actor-link/' + link.url_slug;
            }
            return 'unknown-link';
        }, true);
    });

    it(`checks that url slug is not resolved when the type is incorrect`, () => {
        var actor = new Actor();
        actor.system = new ContentItemSystemAttributes(actorId, 'Joel', 'joel', 'invalid_actor', new Date(), 'en', []);
        var field = new Fields.UrlSlugField('name', 'actor-slug', actor, (link: ILink) => {
            if (link.type === 'actor') {
                return 'actor-link/' + link.url_slug;
            }
            return 'unknown-link';
        }, true);
        expect(field.getUrl()).toEqual('unknown-link');
    });

    it(`url should be null when no resolver is passed`, () => {
        var url = 'test_url';
        url = (new Fields.UrlSlugField('name', 'actor-slug', actor, null, true).getUrl());
        expect(url).toEqual(null);
    });

    it(`url should be null when invalid item is passed`, () => {
        var url = 'test_url';
        url = (new Fields.UrlSlugField('name', 'actor-slug', null, (link) => 'test', true).getUrl());
        expect(url).toEqual(null);
    });

    
    it(`url should be null when resolved url equals to null as well`, () => {
        var url = 'test_url';
        url = (new Fields.UrlSlugField('name', 'actor-slug', null, (link) => null, true).getUrl());
        expect(url).toEqual(null);
    });

});

