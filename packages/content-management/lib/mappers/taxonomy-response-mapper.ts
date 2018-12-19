import { IBaseResponse } from 'kentico-cloud-core';

import { TaxonomyContracts } from '../contracts';
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

    mapDeleteTaxonomyResponse(
        response: IBaseResponse<TaxonomyContracts.IDeleteTaxonomyResponseContract>
    ): TaxonomyResponses.DeleteTaxonomyResponse {

        return new TaxonomyResponses.DeleteTaxonomyResponse(super.mapResponseDebug(response), response.data, undefined);
    }

    mapAddTaxonomyResponse(
        response: IBaseResponse<TaxonomyContracts.IAddTaxonomyResponseContract>
    ): TaxonomyResponses.AddTaxonomyResponse {

        const taxonomy = this.mapTaxonomy(response.data);

        return new TaxonomyResponses.AddTaxonomyResponse(super.mapResponseDebug(response), response.data, taxonomy);
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
