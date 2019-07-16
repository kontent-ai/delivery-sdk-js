import { TestHttpService } from 'kentico-cloud-core';

import { DeliveryClient, IDeliveryClient, IDeliveryClientConfig } from '../../../lib';

const testProjectId: string = 'delivery-project-id';

export function getTestDeliveryClient(config?: IDeliveryClientConfig): IDeliveryClient {
    return new DeliveryClient(config ? config : {
        projectId: testProjectId
    });
}

export function getDeliveryClientWithError(errorJson: any): DeliveryClient {
    return new DeliveryClient({
        projectId: testProjectId,
        httpService: new TestHttpService({
            fakeResponseJson: undefined,
            throwCloudError: true,
            errorJson: errorJson
        })
    });
}

export function getDeliveryClientWithJson(json: any, config?: IDeliveryClientConfig): DeliveryClient {
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
}



