import { ItemContracts } from '../../../lib';
import { FieldContracts } from '../../../lib/data-contracts';
import { FieldType } from '../../../lib/fields/field-type';
import { FieldMapper } from '../../../lib/mappers';
import { Context, setup } from '../../setup';

describe('FieldMapper', () => {

    const fieldType = 'invalid';

    class FakeField implements FieldContracts.IFieldContract {
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

    it(`should log warning to console an Error when unsupported field type is used`, () => {
        console.warn = jasmine.createSpy('warn');

        const fakeField = new FakeField('testField', 'testValue');

        const item: FakeContentItem = {
            elements: { 'testField': fakeField },
            system: {
                type: 'movie',
                codename: 'cd',
                id: '',
                last_modified: '2019-04-11T12:26:37.6196731Z',
                name: 'name',
                sitemap_locations: [],
                language: 'en'
            }
        };

        fieldMapper.mapFields({
            item: item,
            modularContent: {},
            preparedItems: {},
            processedItems: {},
            processingStartedForCodenames: [],
            queryConfig: {}
        });

        expect(console.warn).toHaveBeenCalledTimes(1);

    });
});

