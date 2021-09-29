import { TypeContracts } from '../../data-contracts';
import {
    IKontentListAllResponse,
    IKontentListResponse,
    INetworkResponse,
    IKontentResponse,
    IPagination
} from '../common';
import { IContentType } from './content-type-models';

export namespace TypeResponses {
    export interface IListContentTypesResponse extends IKontentListResponse {
        items: IContentType[];
        pagination: IPagination;
    }

    export interface IListContentTypesAllResponse extends IKontentListAllResponse {
        items: IContentType[];
        responses: INetworkResponse<IListContentTypesResponse, TypeContracts.IListContentTypeContract>[];
    }

    export interface IViewContentTypeResponse extends IKontentResponse {
        type: IContentType;
    }
}
