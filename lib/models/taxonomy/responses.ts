import {
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentNetworkResponse,
    IKontentResponse,
    IPagination
} from '../common';
import { ITaxonomyGroup } from './taxonomy-models';

export namespace TaxonomyResponses {
    export interface IViewTaxonomyResponse extends IKontentResponse {
        taxonomy: ITaxonomyGroup;
    }

    export interface IListTaxonomiesResponse extends IKontentListResponse {
        items: ITaxonomyGroup[];
        pagination: IPagination;
    }

    export interface IListTaxonomiesAllResponse extends IKontentListAllResponse {
        items: ITaxonomyGroup[];
        responses: IKontentNetworkResponse<IListTaxonomiesResponse>[];
    }
}
