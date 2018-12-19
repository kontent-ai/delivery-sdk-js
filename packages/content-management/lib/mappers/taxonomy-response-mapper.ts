import { IBaseResponse } from 'kentico-cloud-core';

import { TaxonomiesContracts as TaxonomyContracts } from '../contracts';
import { TaxonomyModels } from '../models';
import { TaxonomyResponses as TaxonomyResponses } from '../responses';
import { BaseMapper } from './base-mapper';

export class TaxonomyResponseMapper extends BaseMapper {

    mapListingTaxonomysResponse(
        response: IBaseResponse<TaxonomyContracts.ITaxonomyContract[]>
    ): TaxonomyResponses.TaxonomyListResponse {

        const taxonomies = response.data.map(m => this.mapTaxonomy(m));

        return new TaxonomyResponses.TaxonomyListResponse(super.mapResponseDebug(response), response.data, taxonomies);
    }

    private mapTaxonomy(rawTaxonomy: TaxonomyContracts.ITaxonomyContract): TaxonomyModels.Taxonomy {
        return new TaxonomyModels.Taxonomy({
            codename: rawTaxonomy.codename,
            id: rawTaxonomy.id,
            lastModified: new Date(rawTaxonomy.last_modified),
            name: rawTaxonomy.name,
            terms: rawTaxonomy.terms.map(m => this.mapTaxonomy(m))
        });
    }
}

export const taxonomyResponseMapper = new TaxonomyResponseMapper();
