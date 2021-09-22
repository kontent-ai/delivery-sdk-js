import {
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentNetworkResponse,
    IKontentResponse,
    IPagination
} from '../common';
import { ContentType } from './content-type-models';

export namespace TypeResponses {
    export interface IListContentTypesResponse extends IKontentListResponse {
        items: ContentType[];
        pagination: IPagination;
    }

    export interface IListContentTypesAllResponse extends IKontentListAllResponse {
        items: ContentType[];
        responses: IKontentNetworkResponse<IListContentTypesResponse>[];
    }

    export interface IViewContentTypeResponse extends IKontentResponse {
        type: ContentType;
    }
}
