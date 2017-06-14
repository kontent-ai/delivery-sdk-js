// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// real delivery client
import { realDeliveryClient } from '../setup/real-delivery-client';

// delivery client
import { DeliveryClient } from '../../../lib';

// tests
describe('Filters', () => {

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

    it(`inFilter with single value should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .inFilter('elem1', ['val1'])
                .toString()
        );

        var param = url.searchParams.get('elem1[in]');

        expect(param).toEqual('val1');
    });

    it(`inFilter with multiple values should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .inFilter('elem1', ['val1', 'val2'])
                .toString()
        );

        var param = url.searchParams.get('elem1[in]');

        expect(param).toEqual('val1,val2');
    });

    it(`anyFilter with single value should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .anyFilter('elem1', ['val1'])
                .toString()
        );

        var param = url.searchParams.get('elem1[any]');

        expect(param).toEqual('val1');
    });

    it(`anyFilter with multiple values should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .anyFilter('elem1', ['val1', 'val2'])
                .toString()
        );

        var param = url.searchParams.get('elem1[any]');

        expect(param).toEqual('val1,val2');
    });

    it(`containsFilter with single value should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .containsFilter('elem1', ['val1'])
                .toString()
        );

        var param = url.searchParams.get('elem1[contains]');

        expect(param).toEqual('val1');
    });

    it(`containsFilter with multiple value should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .containsFilter('elem1', ['val1', 'val2'])
                .toString()
        );

        var param = url.searchParams.get('elem1[contains]');

        expect(param).toEqual('val1,val2');
    });

    it(`equalsFilter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .equalsFilter('elem1', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1');

        expect(param).toEqual('val1');
    });

    it(`greaterThanFilter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .greaterThanFilter('elem1', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1[gt]');

        expect(param).toEqual('val1');
    });

    it(`greaterThanOrEqualFilter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .greaterThanOrEqualFilter('elem1', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1[gte]');

        expect(param).toEqual('val1');
    });

    it(`lessThanFilter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .lessThanFilter('elem1', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1[lt]');

        expect(param).toEqual('val1');
    });

    it(`lessThanOrEqualFilter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .lessThanOrEqualFilter('elem1', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1[lte]');

        expect(param).toEqual('val1');
    });

    it(`allFilter with single value should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .allFilter('elem1', ['val1'])
                .toString()
        );

        var param = url.searchParams.get('elem1[all]');

        expect(param).toEqual('val1');
    });

    it(`allFilter with multiple values should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .allFilter('elem1', ['val1', 'val2'])
                .toString()
        );

        var param = url.searchParams.get('elem1[all]');

        expect(param).toEqual('val1,val2');
    });

    it(`rangeFilter should be set`, () => {
        var url = new URL(
            deliveryClient.items()
                .rangeFilter('elem1', 1, 10)
                .toString()
        );

        var param = url.searchParams.get('elem1[range]');

        expect(param).toEqual('1,10');
    });

    it(`rangeFilter should throw error when higher value is lower then lower value`, () => {
        expect(() => deliveryClient.items().rangeFilter('elem1', 10, 1)).toThrowError();
    });

    // Null parameter checks

    it(`inFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().inFilter(null, ['val1'])).toThrowError();
    });

    it(`anyFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().anyFilter(null, ['val1'])).toThrowError();
    });

    it(`containsFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().containsFilter(null, ['val1'])).toThrowError();
    });

    it(`greaterThanFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().greaterThanFilter(null, 'val1')).toThrowError();
    });

    it(`greaterThanOrEqualFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().greaterThanOrEqualFilter(null, 'val1')).toThrowError();
    });

    it(`lessThanFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().lessThanFilter(null, 'val1')).toThrowError();
    });

    it(`lessThanOrEqualFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().lessThanOrEqualFilter(null, 'val1')).toThrowError();
    });

    it(`allFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().allFilter(null, [])).toThrowError();
    });

    it(`rangeFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().rangeFilter(null, 1, 4)).toThrowError();
    });

    it(`equalsFilter without field should throw an error`, () => {
        expect(() => deliveryClient.items().equalsFilter(null, 'val1')).toThrowError();
    });

    // trim checks

    it(`inFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .inFilter(' elem1 ', ['val1'])
                .toString()
        );

        var param = url.searchParams.get('elem1[in]');

        expect(param).toEqual('val1');
    });

    it(`allFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .allFilter(' elem1 ', ['val1'])
                .toString()
        );

        var param = url.searchParams.get('elem1[all]');

        expect(param).toEqual('val1');
    });

    it(`anyFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .anyFilter(' elem1 ', ['val1'])
                .toString()
        );

        var param = url.searchParams.get('elem1[any]');

        expect(param).toEqual('val1');
    });

    it(`containsFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .containsFilter(' elem1 ', ['val1'])
                .toString()
        );

        var param = url.searchParams.get('elem1[contains]');

        expect(param).toEqual('val1');
    });

    it(`equalsFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .equalsFilter(' elem1 ', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1');

        expect(param).toEqual('val1');
    });

    it(`greaterThanFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .greaterThanFilter(' elem1 ', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1[gt]');

        expect(param).toEqual('val1');
    });

    it(`greaterThanOrEqualFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .greaterThanOrEqualFilter(' elem1 ', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1[gte]');

        expect(param).toEqual('val1');
    });

    it(`lessThanFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .lessThanFilter(' elem1 ', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1[lt]');

        expect(param).toEqual('val1');
    });

    it(`lessThanOrEqualFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .lessThanOrEqualFilter(' elem1 ', 'val1')
                .toString()
        );

        var param = url.searchParams.get('elem1[lte]');

        expect(param).toEqual('val1');
    });

    it(`rangeFilter should trim its field`, () => {
        var url = new URL(
            deliveryClient.items()
                .rangeFilter(' elem1 ', 1, 10)
                .toString()
        );

        var param = url.searchParams.get('elem1[range]');

        expect(param).toEqual('1,10');
    });

});

