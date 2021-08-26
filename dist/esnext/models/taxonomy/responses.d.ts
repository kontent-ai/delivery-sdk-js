import { IBaseResponse } from '@kentico/kontent-core';
import { BaseKontentResponseStandardDebug, Pagination } from '../common';
import { TaxonomyGroup } from './taxonomy-models';
export declare namespace TaxonomyResponses {
    class ViewTaxonomyGroupResponse extends BaseKontentResponseStandardDebug {
        /**
         * Taxonomy group
         */
        taxonomy: TaxonomyGroup;
        constructor(
        /**
         * Taxonomy group
         */
        taxonomy: TaxonomyGroup, 
        /**
         * Response
         */
        response: IBaseResponse<any>, isDeveloperMode: boolean);
    }
    class ListTaxonomyGroupsResponse extends BaseKontentResponseStandardDebug {
        /**
         * Taxonomies
         */
        taxonomies: TaxonomyGroup[];
        /**
         * Pagination
         */
        pagination: Pagination;
        constructor(
        /**
         * Taxonomies
         */
        taxonomies: TaxonomyGroup[], 
        /**
         * Pagination
         */
        pagination: Pagination, 
        /**
         * Response
         */
        response: IBaseResponse<any>, isDeveloperMode: boolean);
    }
}
