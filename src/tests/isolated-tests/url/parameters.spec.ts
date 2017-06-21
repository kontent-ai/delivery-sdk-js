// url parser
import urlParser from 'url-parse';

// setup
import { Context, setup } from '../../setup';

// models
import { SortOrder } from '../../../../lib';

// tests
describe('Parameters', () => {

    var context = new Context();
    setup(context);

    it(`depth param should be set`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .depthParameter(1)
                .toString()
        );

        var param = url.searchParams.get('depth');

        expect(param).toEqual('1')
    });

    it(`negative depth parameter should throw error`, () => {
        expect(() => context.deliveryClient.items().depthParameter(-1)).toThrowError()
    });

    it(`multiple elements param should be set`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .elementsParameter(["elem1", "elem2"])
                .toString()
        );

        var param = url.searchParams.get('elements');

        expect(param).toEqual('elem1,elem2')
    });

    it(`single elements param should be set`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .elementsParameter(["elem1"])
                .toString()
        );

        var param = url.searchParams.get('elements');

        expect(param).toEqual('elem1')
    });

    it(`limit parameter should be set`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .limitParameter(1)
                .toString()
        );

        var param = url.searchParams.get('limit');

        expect(param).toEqual('1');
    });

    it(`negative limit parameter should throw error`, () => {
        expect(() => context.deliveryClient.items().limitParameter(-1)).toThrowError()
    });

    it(`order (desc) parameter should be set`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .orderParameter('elem1', SortOrder.desc)
                .toString()
        );

        var param = url.searchParams.get('order');

        expect(param).toEqual('elem1[desc]');
    });

    it(`order (asc) parameter should be set`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .orderParameter('elem1', SortOrder.asc)
                .toString()
        );

        var param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });

    it(`order parameter with null 'SortOrder should be default to 'asc'`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .orderParameter('elem1', null)
                .toString()
        );

        var param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });

    it(`skip parameter should be set`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .skipParameter(1)
                .toString()
        );

        var param = url.searchParams.get('skip');

        expect(param).toEqual('1');
    });

    it(`skip parameter with negative skip should throw error`, () => {
        expect(() => context.deliveryClient.items().skipParameter(-1)).toThrowError()
    });

    it(`language parameter should be set`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .languageParameter('en')
                .toString()
        );

        var param = url.searchParams.get('language');

        expect(param).toEqual('en');
    });

    // Null parameter checks

    it(`order parameter with null or empty field should throw an error`, () => {
        expect(() => context.deliveryClient.items().orderParameter(null, SortOrder.asc)).toThrowError();
    });

    it(`elements parameter with empty or not set elements should throw error`, () => {
        expect(() => context.deliveryClient.items().elementsParameter([null]).toString()).toThrowError();
    });

       it(`language parameter with empty or not set elements should throw error`, () => {
        expect(() => context.deliveryClient.items().languageParameter(null).toString()).toThrowError();
    });

    // trim checks

    it(`elementsParameter should trim its field codenames`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .elementsParameter([' elem1', 'elem2', ' elem3'])
                .toString()
        );

        var param = url.searchParams.get('elements');

        expect(param).toEqual('elem1,elem2,elem3');
    });

    it(`orderParameter should trim its field`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .orderParameter(' elem1 ', SortOrder.asc)
                .toString()
        );

        var param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });

      it(`language parameter should trim its field`, () => {
        var url = new URL(
            context.deliveryClient.items()
                .languageParameter(' en ')
                .toString()
        );

        var param = url.searchParams.get('language');

        expect(param).toEqual('en');
    });
});

