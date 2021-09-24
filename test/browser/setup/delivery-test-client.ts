import { IHeader, IResponse, TestHttpService } from '@kentico/kontent-core';
import { defaultPropertyNameResolver } from '.';

import { DeliveryClient, IDeliveryClient, IDeliveryClientConfig } from '../../../lib';

const testProjectId: string = 'delivery-project-id';

export function toPromise<T>(data: T): Promise<T> {
    return new Promise((resolve, reject) => {
        resolve(data);
      });
}

export function getTestDeliveryClient(config?: IDeliveryClientConfig): IDeliveryClient {
    return new DeliveryClient(
        config
            ? config
            : {
                  propertyNameResolver: defaultPropertyNameResolver,
                  projectId: testProjectId
              }
    );
}

export function getDeliveryClientWithError(errorJson: any): DeliveryClient {
    return new DeliveryClient({
        projectId: testProjectId,
        propertyNameResolver: defaultPropertyNameResolver,
        httpService: new TestHttpService({
            response: undefined,
            error: errorJson
        })
    });
}

export function getDeliveryClientWithJson(
    json: any,
    config?: IDeliveryClientConfig,
    responseHeaders: IHeader[] = []
): DeliveryClient {
    return getDeliveryClientWithJsonAndHeaders(json, config, responseHeaders);
}

export function getDeliveryClientWithJsonAndHeaders(
    json: any,
    config?: IDeliveryClientConfig,
    responseHeaders: IHeader[] = []
): DeliveryClient {
    if (!config) {
        return new DeliveryClient({
            projectId: testProjectId,
            propertyNameResolver: defaultPropertyNameResolver,
            httpService: new TestHttpService({
                response: getResponseFromJson(json, responseHeaders),
                error: undefined
            })
        });
    }

    // always set http service
    config.httpService = new TestHttpService({
        response: getResponseFromJson(json, responseHeaders),
        error: undefined
    });

    return new DeliveryClient(config);
}

function getResponseFromJson(json: any, responseHeaders: IHeader[] = []): IResponse<any> {
    return {
        data: json,
        headers: responseHeaders,
        rawResponse: json,
        status: 999,
        retryStrategy: {
            retryAttempts: 1,
            options: {}
        }
    };
}
