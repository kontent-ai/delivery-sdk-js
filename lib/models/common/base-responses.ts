import { IResponse } from '@kentico/kontent-core';

export interface IKontentNetworkResponse<TData, TContract> {
    data: TData;
    response: IResponse<TContract>;
    xContinuationToken?: string;
    hasStaleContent: boolean;
}

export interface IGroupedKontentNetworkResponse<TData> {
    data: TData;
    responses: IKontentNetworkResponse<any, any>[];
}
