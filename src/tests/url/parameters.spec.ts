// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// real delivery client
import { realDeliveryClient } from '../delivery-clients/real-delivery-client';

// delivery client
import { DeliveryClient, SortOrder } from '../../../lib';

// tests
describe('Parameters', () => {

    var deliveryClient: DeliveryClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DeliveryClient, useValue: realDeliveryClient,
                },
            ]
        });

        deliveryClient = TestBed.get(DeliveryClient) as DeliveryClient;
    });

    it(`depth param should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .depthParameter(1)
                .toString()
        );

        var param = url.searchParams.get('depth');

        expect(param).toEqual('1')
    });

    it(`negative depth parameter should throw error`, () => {
        expect(() => deliveryClient.items().depthParameter(-1)).toThrowError()
    });

    it(`multiple elements param should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .elementsParameter(["elem1", "elem2"])
                .toString()
        );

        var param = url.searchParams.get('elements');

        expect(param).toEqual('elem1,elem2')
    });

    it(`single elements param should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .elementsParameter(["elem1"])
                .toString()
        );

        var param = url.searchParams.get('elements');

        expect(param).toEqual('elem1')
    });

    it(`limit parameter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .limitParameter(1)
                .toString()
        );

        var param = url.searchParams.get('limit');

        expect(param).toEqual('1');
    });

    it(`negative limit parameter should throw error`, () => {
        expect(() => deliveryClient.items().limitParameter(-1)).toThrowError()
    });

    it(`order (desc) parameter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .orderParameter('elem1', SortOrder.desc)
                .toString()
        );

        var param = url.searchParams.get('order');

        expect(param).toEqual('elem1[desc]');
    });

    it(`order (asc) parameter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .orderParameter('elem1', SortOrder.asc)
                .toString()
        );

        var param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });

    it(`order parameter with null 'SortOrder should be default to 'asc'`, () => {
        var url = new URL(
            deliveryClient.items()
                .orderParameter('elem1', null)
                .toString()
        );

        var param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });

    it(`skip parameter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .skipParameter(1)
                .toString()
        );

        var param = url.searchParams.get('skip');

        expect(param).toEqual('1');
    });

    it(`skip parameter with negative skip should throw error`, () => {
        expect(() => deliveryClient.items().skipParameter(-1)).toThrowError()
    });

    // Null parameter checks

    it(`order parameter with null or empty field should throw an error`, () => {
        expect(() => deliveryClient.items().orderParameter(null, SortOrder.asc)).toThrowError();
    });

    it(`elements parameter with empty or not set elements should throw error`, () => {
        expect(() => deliveryClient.items().elementsParameter([null]).toString()).toThrowError();
    });

    // trim checks

    it(`elementsParameter should trim its field codenames`, () => {
        var url = new URL(
            deliveryClient.items()
                .elementsParameter([' elem1', 'elem2', ' elem3'])
                .toString()
        );

        var param = url.searchParams.get('elements');

        expect(param).toEqual('elem1,elem2,elem3');
    });

    it(`orderParameter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .orderParameter(' elem1 ', SortOrder.asc)
                .toString()
        );

        var param = url.searchParams.get('order');

        expect(param).toEqual('elem1[asc]');
    });
});

