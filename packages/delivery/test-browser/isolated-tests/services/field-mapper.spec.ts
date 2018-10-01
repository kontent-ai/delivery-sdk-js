import { ItemContracts } from '../../../lib';
import { FieldContracts } from '../../../lib/fields/field-contracts';
import { FieldType } from '../../../lib/fields/field-type';
import { FieldMapper } from '../../../lib/mappers';
import { Context, setup } from '../../setup';

describe('FieldMapper', () => {

    const fieldType = 'invalid';

    class FakeField implements FieldContracts.IField {
        public type: FieldType = fieldType as any;
        constructor(
            public name: string,
            public value: any
        ) {
        }
    }

    interface FakeContentItem extends ItemContracts.IContentItemContract {
        testField?: FakeField;
        elements: any;
    }

    const context = new Context();
    setup(context);

    const fieldMapper = new FieldMapper(context.getConfig(), context.richTextHtmlParser as any);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => fieldMapper.mapFields(null as any, null, null as any, null as any)).toThrowError();
        expect(() => fieldMapper.mapFields(undefined as any, undefined, undefined as any, undefined as any)).toThrowError();

        expect(() => {
            const item: FakeContentItem = {
                elements: {},
                system: {} as any
            };
            fieldMapper.mapFields(item, undefined, undefined as any, undefined as any);
        }).toThrowError();

        expect(() => {
            const item: FakeContentItem = {
                elements: {},
                system: {} as any
            };
            fieldMapper.mapFields(item, undefined, undefined as any, undefined as any);
        }).toThrowError();

        expect(() => {
            const item: FakeContentItem = {
                elements: {},
                system: {} as any
            };
            fieldMapper.mapFields(item, {}, {}, undefined as any);
        }).toThrowError();

    });

    it(`should throw an Error when unsupported field type is used`, () => {
        const fakeField = new FakeField('testField', 'testValue');

        const item: FakeContentItem = {
            elements: { 'testField': fakeField },
            system: {
                type: 'movie',
                codename: 'cd',
                id: '',
                last_modified: new Date(),
                name: 'name',
                sitemap_locations: [],
                language: 'en'
            }
        };

        expect(() => fieldMapper.mapFields(item, {}, {}, [])).toThrowError(`Unsupported field type '${fieldType}'`);
    });
});

