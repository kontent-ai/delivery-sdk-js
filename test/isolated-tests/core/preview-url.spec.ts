// url parser
import urlParser from 'url-parse';

// setup
import { setup, Context } from '../../setup';

import { IHeader } from '../../../lib/interfaces/common/iheader.interface'

// tests
describe('Preview URL', () => {

    const context = new Context({
        usePreviewMode: true
    });

    setup(context);

    it(`origin should be 'https://preview-deliver.kenticocloud.com'`, () => {
        const url = new URL(context.deliveryClient.items().toString());
        expect(url.origin).toEqual('https://preview-deliver.kenticocloud.com')
    });

    it(`preview pathname should contain project id'`, () => {
        const url = context.deliveryClient.items().toString();
        expect(url).toContain(context.projectId)
    });
});

