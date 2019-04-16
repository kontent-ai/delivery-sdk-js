import { ContentItemSystemAttributes, stronglyTypedResolver } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Delivery strongly type resolver', () => {

    const context = new Context();
    setup(context);

    it(`Should throw an Error when invalid response is given`, () => {
        expect(() => stronglyTypedResolver.createEmptyTypedObj(null as any, context.typeResolvers)).toThrowError();
        expect(() => stronglyTypedResolver.createEmptyTypedObj(undefined as any, context.typeResolvers)).toThrowError();
    });

    it(`System properties should be mapped`, () => {

        const systemAttributes = stronglyTypedResolver.mapSystemAttributes({
            codename: 'cd',
            id: 'id',
            language: 'en',
            last_modified: '2019-04-11T12:26:37.6196731Z',
            name: 'name',
            sitemap_locations: [],
            type: 'type'
        });

        expect(systemAttributes).toEqual(jasmine.any(ContentItemSystemAttributes));
        expect(systemAttributes.lastModified).toEqual(jasmine.any(Date));

        expect(systemAttributes.codename).toEqual('cd');
        expect(systemAttributes.id).toEqual('id');
        expect(systemAttributes.language).toEqual('en');
        expect(systemAttributes.name).toEqual('name');
        expect(systemAttributes.sitemapLocations.length).toEqual(0);
    });
});

