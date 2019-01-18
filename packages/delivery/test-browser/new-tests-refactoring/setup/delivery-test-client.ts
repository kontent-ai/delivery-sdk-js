import { TestHttpService } from 'kentico-cloud-core';

import { DeliveryClient, IDeliveryClient, IDeliveryClientConfig } from '../../../lib';

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

export const getDeliveryClientWithJson: (json: any, config?: IDeliveryClientConfig) => IDeliveryClient = (json: any, config?: IDeliveryClientConfig) => {
    if (!config) {
        return new DeliveryClient({
            projectId: testProjectId,
            httpService: new TestHttpService({
                fakeResponseJson: json,
                throwCloudError: false
            })
        });
    }

    // always set http service
    config.httpService = new TestHttpService({
        fakeResponseJson: json,
        throwCloudError: false
    });

    return new DeliveryClient(config);
};


