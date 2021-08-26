import { TestHttpService, IHeader } from '@kentico/kontent-core';

import { DeliveryClient, IDeliveryClient, IDeliveryClientConfig } from '../../../../lib';

const testProjectId: string = 'delivery-project-id';

export function getTestDeliveryClient(config?: IDeliveryClientConfig): IDeliveryClient {
    return new DeliveryClient(config ? config : {
        projectId: testProjectId,
    });
}

export function getDeliveryClientWithError(errorJson: any): DeliveryClient {
    return new DeliveryClient({
        projectId: testProjectId,
        httpService: new TestHttpService({
            fakeResponseJson: undefined,
            throwError: true,
            errorJson: errorJson,
            fakeHeaders: []
        })
    });
}

export function getDeliveryClientWithJson(json: any, config?: IDeliveryClientConfig): DeliveryClient {
   return this.getDeliveryClientWithJsonAndHeaders(json, [], config);
}

export function getDeliveryClientWithJsonAndHeaders(json: any, headers: IHeader[], config?: IDeliveryClientConfig): DeliveryClient {
    if (!config) {
        return new DeliveryClient({
            projectId: testProjectId,
            httpService: new TestHttpService({
                fakeResponseJson: json,
                throwError: false,
                fakeHeaders: headers,
                fakeStatusCode: 200
            })
        });
    }

    // always set http service
    config.httpService = new TestHttpService({
        fakeResponseJson: json,
        throwError: false,
        fakeHeaders: headers,
        fakeStatusCode: 200
    });

    return new DeliveryClient(config);
}



