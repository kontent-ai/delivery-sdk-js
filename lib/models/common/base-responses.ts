import { IResponse } from '@kentico/kontent-core';

export interface IKontentNetworkResponse<TData> {
    data: TData;
    response: IResponse<any>;
    xContinuationToken?: string;
    hasStaleContent: boolean;
}

export interface IGroupedKontentNetworkResponse<TData> {
    data: TData;
    responses: IKontentNetworkResponse<any>[];
}
