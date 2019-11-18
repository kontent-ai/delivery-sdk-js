import { Parameters, SortOrder } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Item url parameters', () => {

    const context = new Context();
    setup(context);

    it(`includeTotalCount parameter should be set to true when used`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .includeTotalCountParameter()
                .getUrl()
        );

        const param = url.searchParams.get('includeTotalCount');

        expect(param).toEqual('true');
    });

    it(`depth param should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .depthParameter(1)
                .getUrl()
        );

        const param = url.searchParams.get('depth');

        expect(param).toEqual('1');
    });

    it(`negative depth parameter should throw error`, () => {
        expect(() => context.deliveryClient.items().depthParameter(-1)).toThrowError();
    });

    it(`multiple elements param should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .elementsParameter(['elem1', 'elem2'])
                .getUrl()
        );

        const param = url.searchParams.get('elements');

        expect(param).toEqual('elem1,elem2');
    });

    it(`single elements param should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .elementsParameter(['elem1'])
                .getUrl()
        );

        const param = url.searchParams.get('elements');

        expect(param).toEqual('elem1');
    });

    it(`limit parameter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .limitParameter(1)
                .getUrl()
        );

        const param = url.searchParams.get('limit');

        expect(param).toEqual('1');
    });

    it(`negative limit parameter should throw error`, () => {
        expect(() => context.deliveryClient.items().limitParameter(-1)).toThrowError();
    });

    it(`order (desc) parameter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .orderParameter('elem1', SortOrder.desc)
                .getUrl()
        );

        const param = url.searchParams.get('order');

        expect(param).toEqual('elem1[desc]');
    });

    it(`order (asc) parameter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .orderParameter('elem1', SortOrder.asc)
                .getUrl()
        );

        const param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });

    it(`order parameter with null 'SortOrder should be default to 'asc'`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .orderParameter('elem1', null as any)
                .getUrl()
        );

        const param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });

    it(`orderByDescending should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .orderByDescending('elem1')
                .getUrl()
        );

        const param = url.searchParams.get('order');

        expect(param).toEqual('elem1[desc]');
    });

    it(`orderByAscending should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .orderByAscending('elem1')
                .getUrl()
        );

        const param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });

    it(`skip parameter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .skipParameter(1)
                .getUrl()
        );

        const param = url.searchParams.get('skip');

        expect(param).toEqual('1');
    });

    it(`skip parameter with negative skip should throw error`, () => {
        expect(() => context.deliveryClient.items().skipParameter(-1)).toThrowError();
    });

    it(`language parameter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .languageParameter('en')
                .getUrl()
        );

        const param = url.searchParams.get('language');

        expect(param).toEqual('en');
    });

    // Null parameter checks

    it(`order parameter with null or empty element should throw an error`, () => {
        expect(() => context.deliveryClient.items().orderParameter(null as any, SortOrder.asc)).toThrowError();
    });

    it(`elements parameter with empty or not set elements should throw error`, () => {
        expect(() => context.deliveryClient.items().elementsParameter([null as any]).getUrl()).toThrowError();
    });

       it(`language parameter with empty or not set elements should throw error`, () => {
        expect(() => context.deliveryClient.items().languageParameter(null as any).getUrl()).toThrowError();
    });

    // trim checks

    it(`elementsParameter should trim its element codenames`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .elementsParameter([' elem1', 'elem2', ' elem3'])
                .getUrl()
        );

        const param = url.searchParams.get('elements');

        expect(param).toEqual('elem1,elem2,elem3');
    });

    it(`orderParameter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .orderParameter(' elem1 ', SortOrder.asc)
                .getUrl()
        );

        const param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });

      it(`language parameter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .languageParameter(' en ')
                .getUrl()
        );

        const param = url.searchParams.get('language');

        expect(param).toEqual('en');
    });

    // empty value checks
    it(`ElementsParameter without value should return empty string as param value`, () => {
        expect(new Parameters.ElementsParameter(undefined as any).getParamValue()).toEqual('');
    });
});

