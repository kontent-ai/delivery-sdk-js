import { IDeliveryNetworkResponse, Responses } from '../../../../../lib';
import { Context, getTestDeliveryClient, setup } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../../setup';
import * as responseJson from './used-in.spec.json';

describe('Used in', () => {
    const context = new Context();
    setup(context);

    const query = getDeliveryClientWithJsonAndHeaders(
        responseJson,
        {
            environmentId: 'x'
        },
        [
            {
                value: 'TokenX',
                header: 'X-Continuation'
            }
        ]
    ).itemUsedIn('product');

    let response: IDeliveryNetworkResponse<Responses.IUsedInResponse<any>, any>;

    beforeAll(async () => {
        response = await query.toPromise();
    });

    it(`Validates asset used in url`, () => {
        expect(getTestDeliveryClient().assetUsedIn('x').getUrl()).toEqual(
            'https://deliver.kontent.ai/delivery-environment-id/assets/x/used-in'
        );
    });

    it(`Validates content item used in url`, () => {
        expect(getTestDeliveryClient().itemUsedIn('x').getUrl()).toEqual(
            'https://deliver.kontent.ai/delivery-environment-id/items/x/used-in'
        );
    });

    it(`Continuation token should be set`, () => {
        expect(response.xContinuationToken).toEqual('TokenX');
    });

    it(`Validates mapped item`, () => {
        const item = response.data.items[0];
        const sourceItem = responseJson.items[0];

        expect(item.system.id).toEqual(sourceItem.system.id);
        expect(item.system.name).toEqual(sourceItem.system.name);
        expect(item.system.codename).toEqual(sourceItem.system.codename);
        expect(item.system.language).toEqual(sourceItem.system.language);
        expect(item.system.type).toEqual(sourceItem.system.type);
        expect(item.system.collection).toEqual(sourceItem.system.collection);
        expect(item.system.lastModified).toEqual(sourceItem.system.last_modified);
        expect(item.system.workflow).toEqual(sourceItem.system.workflow);
        expect(item.system.workflowStep).toEqual(sourceItem.system.workflow_step);
    });
});
