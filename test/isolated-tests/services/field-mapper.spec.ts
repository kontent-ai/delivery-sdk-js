import { ContentItem } from '../../../lib';
import { FieldInterfaces } from '../../../lib/fields/field-interfaces';
import { FieldType } from '../../../lib/fields/field-type';
import { FieldMapper } from '../../../lib/mappers';
import { QueryConfig } from '../../../lib/models/common/query.config';
import { Context, setup } from '../../setup';

describe('FieldMapper', () => {

    const fieldType = 'invalid';

    class FakeField implements FieldInterfaces.IField {
        public type: FieldType = fieldType as any;
        constructor(
            public name: string,
            public value: any
        ) {
        }
    }

    class FakeContentItem extends ContentItem {
        public testField: FakeField;
        public elements: any;
    }

    const context = new Context();
    setup(context);

    const fieldMapper = new FieldMapper(context.getConfig(), context.richTextHtmlParser);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => fieldMapper.mapFields(null, null, null, null)).toThrowError();
        expect(() => fieldMapper.mapFields(undefined, undefined, undefined, undefined)).toThrowError();

        expect(() => {
            const item = new FakeContentItem();
            item.elements = {};
            fieldMapper.mapFields(item, undefined, undefined, undefined);
        } ).toThrowError();

        expect(() => {
            const item = new FakeContentItem();
            item.system = {} as any;
            fieldMapper.mapFields(item, undefined, undefined, undefined);
        } ).toThrowError();

        expect(() => {
            const item = new FakeContentItem();
            item.system = {} as any;
            fieldMapper.mapFields(item, {}, new QueryConfig(), undefined);
        } ).toThrowError();

    });

    it(`should throw an Error when unsupported field type is used`, () => {
        const fakeField = new FakeField('testField', 'testValue');

        const fakeItem = new FakeContentItem();
        fakeItem.elements = { 'testField': fakeField };
        fakeItem.system = {} as any;
        fakeItem.system.type = 'movie';
        fakeItem.system.codename = 'cd';
        expect(() => fieldMapper.mapFields(fakeItem, {}, {}, [])).toThrowError(`Unsupported field type '${fieldType}'`);
    });
});

