import { ItemContracts, ElementType } from '../../../lib';
import { ElementContracts } from '../../../lib/data-contracts';
import { ElementMapper } from '../../../lib/mappers';
import { Context, setup } from '../../setup';

describe('ElementMapper', () => {

    const elementType = 'invalid';

    class FakeElement implements ElementContracts.IElementContract {
        public type: ElementType = elementType as any;
        constructor(
            public name: string,
            public value: any
        ) {
        }
    }

    interface FakeContentItem extends ItemContracts.IContentItemContract {
        testElement?: FakeElement;
        elements: any;
    }

    const context = new Context();
    setup(context);

    const elementMapper = new ElementMapper(context.getConfig(), context.richTextHtmlParser as any);

    it(`should log warning to console an Error when unsupported element type is used`, () => {
        console.warn = jasmine.createSpy('warn');

        const fakeElement = new FakeElement('testElement', 'testValue');

        const systemData = {
            type: 'movie',
                codename: 'cd',
                id: '',
                last_modified: '2019-04-11T12:26:37.6196731Z',
                name: 'name',
                sitemap_locations: [],
                language: 'en'
        };

        const item: FakeContentItem = {
            elements: { 'testElement': fakeElement },
            system: systemData
        };

        elementMapper.mapElements({
            item: item,
            preparedItems: {
                'cd': {
                    _raw: null as any,
                    system: systemData as any,
                    getAllElements: () => []
                }
            },
            processedItems: {},
            processingStartedForCodenames: [],
            queryConfig: {},
        });

        expect(console.warn).toHaveBeenCalledTimes(1);

    });
});

