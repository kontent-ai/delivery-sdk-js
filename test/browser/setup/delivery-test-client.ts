import { IHeader, IResponse, TestHttpService } from '@kontent-ai/core-sdk';

import { createDeliveryClient, IDeliveryClient, IDeliveryClientConfig } from '../../../lib';

const testenvironmentId: string = 'delivery-environment-id';

export function toPromise<T>(data: T): Promise<T> {
    return new Promise((resolve, reject) => {
        resolve(data);
    });
}

export function getTestDeliveryClient(config?: IDeliveryClientConfig): IDeliveryClient {
    return createDeliveryClient(
        config
            ? config
            : {
                  environmentId: testenvironmentId
              }
    );
}

export function getDeliveryClientWithError(errorJson: any): IDeliveryClient {
    return createDeliveryClient({
        environmentId: testenvironmentId,
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
): IDeliveryClient {
    return getDeliveryClientWithJsonAndHeaders(json, config, responseHeaders);
}

export function getDeliveryClientWithJsonAndHeaders(
    json: any,
    config?: IDeliveryClientConfig,
    responseHeaders: IHeader[] = []
): IDeliveryClient {
    if (!config) {
        return createDeliveryClient({
            environmentId: testenvironmentId,
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

    return createDeliveryClient(config);
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
