import { TaxonomyContracts } from '../../contracts';
import { TaxonomyModels, SharedModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace TaxonomyResponses {

    export class TaxonomyListResponse extends BaseResponses.BaseContentManagementResponse<TaxonomyContracts.ITemporaryTaxonomyListResponse, {
        taxonomies: TaxonomyModels.Taxonomy[],
        pagination: SharedModels.Pagination
    }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: TaxonomyContracts.ITemporaryTaxonomyListResponse,
            data: {
                taxonomies: TaxonomyModels.Taxonomy[],
                pagination: SharedModels.Pagination
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class AddTaxonomyResponse extends BaseResponses.BaseContentManagementResponse<TaxonomyContracts.IAddTaxonomyResponseContract, TaxonomyModels.Taxonomy>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: TaxonomyContracts.IAddTaxonomyResponseContract,
            data: TaxonomyModels.Taxonomy
        ) {
            super(debug, rawData, data);
        }
    }

    export class DeleteTaxonomyResponse extends BaseResponses.BaseContentManagementResponse<TaxonomyContracts.IDeleteTaxonomyResponseContract, void>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: TaxonomyContracts.IDeleteTaxonomyResponseContract,
            data: void
        ) {
            super(debug, rawData, data);
        }
    }
}
