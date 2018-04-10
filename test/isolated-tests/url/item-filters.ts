import { Filters } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Item url filters', () => {

    const context = new Context();
    setup(context);

    it(`type filter with single string should be set`, () => {
        const type = 'TypeA';
        const url = new URL(
            context.deliveryClient.items()
                .type(type)
                .getUrl()
        );

        const param = url.searchParams.get('system.type');

        expect(param).toEqual(type);
    });

    it(`type filter with multiple strings should be set`, () => {
        const typeA = 'TypeA';
        const typeB = 'TypeB';

        const types = [typeA, typeB];
        const url = new URL(
            context.deliveryClient.items()
                .types(types)
                .getUrl()
        );

        const param = url.searchParams.get('system.type[in]');

        expect(param).toEqual(`${typeA},${typeB}`);
    });

    it(`inFilter with single value should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .inFilter('elem1', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[in]');

        expect(param).toEqual('val1');
    });

    it(`inFilter with multiple values should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .inFilter('elem1', ['val1', 'val2'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[in]');

        expect(param).toEqual('val1,val2');
    });

    it(`anyFilter with single value should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .anyFilter('elem1', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[any]');

        expect(param).toEqual('val1');
    });

    it(`anyFilter with multiple values should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .anyFilter('elem1', ['val1', 'val2'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[any]');

        expect(param).toEqual('val1,val2');
    });

    it(`containsFilter with single value should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .containsFilter('elem1', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[contains]');

        expect(param).toEqual('val1');
    });

    it(`containsFilter with multiple value should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .containsFilter('elem1', ['val1', 'val2'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[contains]');

        expect(param).toEqual('val1,val2');
    });

    it(`equalsFilter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .equalsFilter('elem1', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1');

        expect(param).toEqual('val1');
    });

    it(`greaterThanFilter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .greaterThanFilter('elem1', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[gt]');

        expect(param).toEqual('val1');
    });

    it(`greaterThanOrEqualFilter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .greaterThanOrEqualFilter('elem1', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[gte]');

        expect(param).toEqual('val1');
    });

    it(`lessThanFilter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .lessThanFilter('elem1', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[lt]');

        expect(param).toEqual('val1');
    });

    it(`lessThanOrEqualFilter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .lessThanOrEqualFilter('elem1', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[lte]');

        expect(param).toEqual('val1');
    });

    it(`allFilter with single value should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .allFilter('elem1', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[all]');

        expect(param).toEqual('val1');
    });

    it(`allFilter with multiple values should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .allFilter('elem1', ['val1', 'val2'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[all]');

        expect(param).toEqual('val1,val2');
    });

    it(`rangeFilter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .rangeFilter('elem1', 1, 10)
                .getUrl()
        );

        const param = url.searchParams.get('elem1[range]');

        expect(param).toEqual('1,10');
    });

    it(`rangeFilter should throw error when higher value is lower then lower value`, () => {
        expect(() => context.deliveryClient.items().rangeFilter('elem1', 10, 1)).toThrowError();
    });

    // Null parameter checks

    it(`inFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().inFilter(null, ['val1'])).toThrowError();
    });

    it(`anyFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().anyFilter(null, ['val1'])).toThrowError();
    });

    it(`containsFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().containsFilter(null, ['val1'])).toThrowError();
    });

    it(`greaterThanFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().greaterThanFilter(null, 'val1')).toThrowError();
    });

    it(`greaterThanOrEqualFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().greaterThanOrEqualFilter(null, 'val1')).toThrowError();
    });

    it(`lessThanFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().lessThanFilter(null, 'val1')).toThrowError();
    });

    it(`lessThanOrEqualFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().lessThanOrEqualFilter(null, 'val1')).toThrowError();
    });

    it(`allFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().allFilter(null, [])).toThrowError();
    });

    it(`rangeFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().rangeFilter(null, 1, 4)).toThrowError();
    });

    it(`equalsFilter without field should throw an error`, () => {
        expect(() => context.deliveryClient.items().equalsFilter(null, 'val1')).toThrowError();
    });

    // null value checks

    it(`EqualsFilter without value should return empty string as param value`, () => {
        expect(new Filters.EqualsFilter('f', undefined).getParamValue()).toEqual('');
    });

    it(`AllFilter without value should return empty string as param value`, () => {
        expect(new Filters.AllFilter('f', undefined).getParamValue()).toEqual('');
    });

    it(`AnyFilter without value should return empty string as param value`, () => {
        expect(new Filters.AnyFilter('f', undefined).getParamValue()).toEqual('');
    });

    it(`ContainsFilter without value should return empty string as param value`, () => {
        expect(new Filters.ContainsFilter('f', undefined).getParamValue()).toEqual('');
    });

    it(`GreaterThanFilter without value should return empty string as param value`, () => {
        expect(new Filters.GreaterThanFilter('f', undefined).getParamValue()).toEqual('');
    });

    it(`GreaterThanOrEqualFilter without value should return empty string as param value`, () => {
        expect(new Filters.GreaterThanOrEqualFilter('f', undefined).getParamValue()).toEqual('');
    });

    it(`Infilter without value should return empty string as param value`, () => {
        expect(new Filters.Infilter('f', undefined).getParamValue()).toEqual('');
    });

    it(`LessThanFilter without value should return empty string as param value`, () => {
        expect(new Filters.LessThanFilter('f', undefined).getParamValue()).toEqual('');
    });

    it(`LessThanOrEqualFilter without value should return empty string as param value`, () => {
        expect(new Filters.LessThanOrEqualFilter('f', undefined).getParamValue()).toEqual('');
    });

    it(`RangeFilter without value should return empty string as param value`, () => {
        expect(new Filters.RangeFilter('f', undefined, 3).getParamValue()).toEqual(',3');
    });

    it(`RangeFilter without value should return empty string as param value`, () => {
        expect(new Filters.RangeFilter('f', 3, undefined).getParamValue()).toEqual('3,');
    });
    // trim checks

    it(`inFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .inFilter(' elem1 ', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[in]');

        expect(param).toEqual('val1');
    });

    it(`allFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .allFilter(' elem1 ', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[all]');

        expect(param).toEqual('val1');
    });

    it(`anyFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .anyFilter(' elem1 ', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[any]');

        expect(param).toEqual('val1');
    });

    it(`containsFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .containsFilter(' elem1 ', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[contains]');

        expect(param).toEqual('val1');
    });

    it(`equalsFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .equalsFilter(' elem1 ', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1');

        expect(param).toEqual('val1');
    });

    it(`greaterThanFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .greaterThanFilter(' elem1 ', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[gt]');

        expect(param).toEqual('val1');
    });

    it(`greaterThanOrEqualFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .greaterThanOrEqualFilter(' elem1 ', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[gte]');

        expect(param).toEqual('val1');
    });

    it(`lessThanFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .lessThanFilter(' elem1 ', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[lt]');

        expect(param).toEqual('val1');
    });

    it(`lessThanOrEqualFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .lessThanOrEqualFilter(' elem1 ', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[lte]');

        expect(param).toEqual('val1');
    });

    it(`rangeFilter should trim its field`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .rangeFilter(' elem1 ', 1, 10)
                .getUrl()
        );

        const param = url.searchParams.get('elem1[range]');

        expect(param).toEqual('1,10');
    });

});

