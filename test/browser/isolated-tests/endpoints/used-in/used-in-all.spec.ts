import { IGroupedNetworkResponse, Responses } from '../../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJsonAndHeaders } from '../../../setup';
import * as responseJson from './used-in-all.spec.json';

describe('Used in', () => {
    const context = new Context();
    setup(context);

    let response: IGroupedNetworkResponse<Responses.IUsedInAllResponse<any>>;

    beforeAll(async () => {
        response = await getDeliveryClientWithJsonAndHeaders(
            responseJson,
            {
                environmentId: 'x'
            },
            []
        )
            .itemUsedIn('x')
            .queryConfig({
                disableItemLinking: false
            })
            .toAllPromise();
    });

    it(`Validate responses counts`, () => {
        expect(response.responses.length).toEqual(1);
    });

    it(`Validate items count`, () => {
        expect(response.data.items.length).toEqual(responseJson.items.length);
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
