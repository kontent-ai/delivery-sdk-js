import {
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentNetworkResponse,
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
        responses: IKontentNetworkResponse<IListContentTypesResponse>[];
    }

    export interface IViewContentTypeResponse extends IKontentResponse {
        type: IContentType;
    }
}
