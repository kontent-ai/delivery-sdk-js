import { TestHttpService } from 'kentico-cloud-core';

import { DeliveryClient, IDeliveryClient } from '../../../lib';

const testProjectId: string = 'delivery-project-id';

export const testDeliveryClient: IDeliveryClient = new DeliveryClient({
    projectId: testProjectId
});

export const getDeliveryClientWithError: (errorJson: any) => IDeliveryClient = (errorJson: any) => new DeliveryClient({
    projectId: testProjectId,
    httpService: new TestHttpService({
        fakeResponseJson: undefined,
        throwCloudError: true,
        errorJson: errorJson
    })
});

export const getDeliveryClientWithJson: (json: any) => IDeliveryClient = (json: any) => new DeliveryClient({
    projectId: testProjectId,
    httpService: new TestHttpService({
        fakeResponseJson: json,
        throwCloudError: false
    })
});
