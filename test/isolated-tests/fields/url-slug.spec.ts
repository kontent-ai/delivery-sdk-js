// setup
import { setup, Context, Movie, Actor } from '../../setup';

// models
import { Fields, ContentItemSystemAttributes, ILink } from '../../../lib';

// tests
describe('URLSlugField', () => {
    var actor = new Actor();
    var actorId = '3294e4b0-e58b-49d7-85fa-5bc9a86556ec';
    actor.system = new ContentItemSystemAttributes(actorId, 'Joel', 'joel', 'actor', new Date(), 'en', []);

    var html = `
    <p><a data-item-id=\"${actorId}\" href=\"\">Joel Edgerton</a> and <a data-item-id=\"d1557cb1-d7ec-4d04-9742-f86b52bc34fc\" href=\"\">Tom Hardy</a></p>
    `;

    var field1 = new Fields.UrlSlugField('name', 'actor-slug', actor, (link: ILink) => 'resolved-link/' + link.url_slug, true);
    var field2 = new Fields.UrlSlugField('name', 'actor-slug', actor, (link: ILink) => {
        if (link.type === 'actor') {
            return 'actor-link/' + link.url_slug;
        }
        return 'unknown-link';
    }, true);

    var actor3 = new Actor();
    actor3.system = new ContentItemSystemAttributes(actorId, 'Joel', 'joel', 'invalid_actor', new Date(), 'en', []);
    var field3 = new Fields.UrlSlugField('name', 'actor-slug', actor3, (link: ILink) => {
        if (link.type === 'actor') {
            return 'actor-link/' + link.url_slug;
        }
        return 'unknown-link';
    }, true);

    it(`checks that field is defined`, () => {
        expect(field1.name).toBeDefined();
    });

    it(`checks that url slug is resolved #1`, () => {
        expect(field1.getUrl()).toEqual('resolved-link/actor-slug');
    });

    it(`checks that url slug is resolved only for given type`, () => {
        expect(field2.getUrl()).toEqual('actor-link/actor-slug');
    });

    it(`checks that url slug is not resolved when the type is incorrect`, () => {
        expect(field3.getUrl()).toEqual('unknown-link');
    });
});

