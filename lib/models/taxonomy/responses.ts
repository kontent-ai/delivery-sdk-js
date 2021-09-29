import { TaxonomyContracts } from '../../data-contracts';
import {
    IKontentListAllResponse,
    IKontentListResponse,
    INetworkResponse,
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
        responses: INetworkResponse<IListTaxonomiesResponse, TaxonomyContracts.IListTaxonomyGroupsContract>[];
    }
}
