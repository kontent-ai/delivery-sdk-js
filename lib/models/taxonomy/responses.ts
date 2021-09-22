import {
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentNetworkResponse,
    IKontentResponse,
    IPagination
} from '../common';
import { TaxonomyGroup } from './taxonomy-models';

export namespace TaxonomyResponses {
    export interface IViewTaxonomyResponse extends IKontentResponse {
        taxonomy: TaxonomyGroup;
    }

    export interface IListTaxonomiesResponse extends IKontentListResponse {
        items: TaxonomyGroup[];
        pagination: IPagination;
    }

    export interface IListTaxonomiesAllResponse extends IKontentListAllResponse {
        items: TaxonomyGroup[];
        responses: IKontentNetworkResponse<IListTaxonomiesResponse>[];
    }
}
