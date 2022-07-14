import { IResponse } from '@kontent-ai/core-sdk';

export interface IDeliveryNetworkResponse<TData, TContract> {
    data: TData;
    response: IResponse<TContract>;
    xContinuationToken?: string;
    hasStaleContent: boolean;
}

export interface IGroupedNetworkResponse<TData> {
    data: TData;
    responses: IDeliveryNetworkResponse<any, any>[];
}
