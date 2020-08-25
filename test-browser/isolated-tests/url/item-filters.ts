import { Context, setup } from '../../setup';

describe('Item url filters', () => {

    const context = new Context();
    setup(context);

    it(`empty filter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .emptyFilter('x')
                .getUrl()
        );

        const param = url.searchParams.get('x[empty]');

        expect(param).toBeDefined();
    });

    it(`notEmpty filter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .notEmptyFilter('x')
                .getUrl()
        );

        const param = url.searchParams.get('x[nempty]');

        expect(param).toBeDefined();
    });

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
                .notInFilter('elem1', ['val1', 'val2'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[nin]');

        expect(param).toEqual('val1,val2');
    });

    it(`notInFilter with single value should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .notInFilter('elem1', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[nin]');

        expect(param).toEqual('val1');
    });

    it(`notInFilter with multiple values should be set`, () => {
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

        const param = url.searchParams.get('elem1[eq]');

        expect(param).toEqual('val1');
    });

    it(`notEqualsFilter should be set`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .notEqualsFilter('elem1', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[neq]');

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


    it(`inFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().inFilter(null as any, ['val1'])).toThrowError();
    });

    it(`anyFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().anyFilter(null as any, ['val1'])).toThrowError();
    });

    it(`containsFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().containsFilter(null as any, ['val1'])).toThrowError();
    });

    it(`greaterThanFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().greaterThanFilter(null as any, 'val1')).toThrowError();
    });

    it(`greaterThanOrEqualFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().greaterThanOrEqualFilter(null as any, 'val1')).toThrowError();
    });

    it(`lessThanFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().lessThanFilter(null as any, 'val1')).toThrowError();
    });

    it(`lessThanOrEqualFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().lessThanOrEqualFilter(null as any, 'val1')).toThrowError();
    });

    it(`allFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().allFilter(null as any, [])).toThrowError();
    });

    it(`rangeFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().rangeFilter(null as any, 1, 4)).toThrowError();
    });

    it(`equalsFilter without element should throw an error`, () => {
        expect(() => context.deliveryClient.items().equalsFilter(null as any, 'val1')).toThrowError();
    });

    // trim checks

    it(`inFilter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .inFilter(' elem1 ', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[in]');

        expect(param).toEqual('val1');
    });

    it(`allFilter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .allFilter(' elem1 ', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[all]');

        expect(param).toEqual('val1');
    });

    it(`anyFilter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .anyFilter(' elem1 ', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[any]');

        expect(param).toEqual('val1');
    });

    it(`containsFilter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .containsFilter(' elem1 ', ['val1'])
                .getUrl()
        );

        const param = url.searchParams.get('elem1[contains]');

        expect(param).toEqual('val1');
    });

    it(`greaterThanFilter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .greaterThanFilter(' elem1 ', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[gt]');

        expect(param).toEqual('val1');
    });

    it(`greaterThanOrEqualFilter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .greaterThanOrEqualFilter(' elem1 ', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[gte]');

        expect(param).toEqual('val1');
    });

    it(`lessThanFilter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .lessThanFilter(' elem1 ', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[lt]');

        expect(param).toEqual('val1');
    });

    it(`lessThanOrEqualFilter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .lessThanOrEqualFilter(' elem1 ', 'val1')
                .getUrl()
        );

        const param = url.searchParams.get('elem1[lte]');

        expect(param).toEqual('val1');
    });

    it(`rangeFilter should trim its element`, () => {
        const url = new URL(
            context.deliveryClient.items()
                .rangeFilter(' elem1 ', 1, 10)
                .getUrl()
        );

        const param = url.searchParams.get('elem1[range]');

        expect(param).toEqual('1,10');
    });

});

