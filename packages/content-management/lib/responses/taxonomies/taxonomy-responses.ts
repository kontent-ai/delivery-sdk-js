import { TaxonomyContracts } from '../../contracts';
import { TaxonomyModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace TaxonomyResponses {

    export class TaxonomyListResponse extends BaseResponses.BaseContentManagementResponse<TaxonomyContracts.ITaxonomyContract[], TaxonomyModels.Taxonomy[]>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: TaxonomyContracts.ITaxonomyContract[],
            data: TaxonomyModels.Taxonomy[]
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
