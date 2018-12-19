import { TaxonomiesContracts } from '../../contracts';
import { TaxonomyModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace TaxonomyResponses {

    export class TaxonomyListResponse extends BaseResponses.BaseContentManagementResponse<TaxonomiesContracts.ITaxonomyContract[], TaxonomyModels.Taxonomy[]>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: TaxonomiesContracts.ITaxonomyContract[],
            data: TaxonomyModels.Taxonomy[]
        ) {
            super(debug, rawData, data);
        }
    }
}
