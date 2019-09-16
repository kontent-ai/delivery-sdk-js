import { IBaseResponse } from '@kentico/kontent-core';

import { TaxonomyContracts } from '../contracts';
import { TaxonomyModels, SharedModels } from '../models';
import { TaxonomyResponses as TaxonomyResponses } from '../responses';
import { BaseMapper } from './base-mapper';

export class TaxonomyResponseMapper extends BaseMapper {

    mapListingTaxonomysResponse(
        response: IBaseResponse<TaxonomyContracts.ITemporaryTaxonomyListResponse>
    ): TaxonomyResponses.TaxonomyListResponse {

        let taxonomies: TaxonomyModels.Taxonomy[];
        let pagination: SharedModels.Pagination;

        // temporary mapping of taxonomies before API breaking change
        if (Array.isArray(response.data)) {
             taxonomies = response.data.map(m => this.mapTaxonomy(m));
             pagination = new SharedModels.Pagination(null, null);
        } else {
            // new API response model
            taxonomies = response.data.taxonomies.map(m => this.mapTaxonomy(m));
            pagination = super.mapPagination(response.data.pagination);
        }

        return new TaxonomyResponses.TaxonomyListResponse(super.mapResponseDebug(response), response.data, {
            pagination: pagination,
            taxonomies: taxonomies
        });
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
