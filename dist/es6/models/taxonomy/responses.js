import { BaseKontentResponseStandardDebug } from '../common';
export var TaxonomyResponses;
(function (TaxonomyResponses) {
    class ViewTaxonomyGroupResponse extends BaseKontentResponseStandardDebug {
        constructor(
        /**
         * Taxonomy group
         */
        taxonomy, 
        /**
         * Response
         */
        response, isDeveloperMode) {
            super(response, isDeveloperMode);
            this.taxonomy = taxonomy;
        }
    }
    TaxonomyResponses.ViewTaxonomyGroupResponse = ViewTaxonomyGroupResponse;
    class ListTaxonomyGroupsResponse extends BaseKontentResponseStandardDebug {
        constructor(
        /**
         * Taxonomies
         */
        taxonomies, 
        /**
         * Pagination
         */
        pagination, 
        /**
         * Response
         */
        response, isDeveloperMode) {
            super(response, isDeveloperMode);
            this.taxonomies = taxonomies;
            this.pagination = pagination;
        }
    }
    TaxonomyResponses.ListTaxonomyGroupsResponse = ListTaxonomyGroupsResponse;
})(TaxonomyResponses || (TaxonomyResponses = {}));
//# sourceMappingURL=responses.js.map