import { IResponse } from '@kentico/kontent-core';

export interface INetworkResponse<TData, TContract> {
    data: TData;
    response: IResponse<TContract>;
    xContinuationToken?: string;
    hasStaleContent: boolean;
}

export interface IGroupedNetworkResponse<TData> {
    data: TData;
    responses: INetworkResponse<any, any>[];
}
