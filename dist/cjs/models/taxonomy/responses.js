"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomyResponses = void 0;
const common_1 = require("../common");
var TaxonomyResponses;
(function (TaxonomyResponses) {
    class ViewTaxonomyGroupResponse extends common_1.BaseKontentResponseStandardDebug {
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
    class ListTaxonomyGroupsResponse extends common_1.BaseKontentResponseStandardDebug {
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
})(TaxonomyResponses = exports.TaxonomyResponses || (exports.TaxonomyResponses = {}));
//# sourceMappingURL=responses.js.map