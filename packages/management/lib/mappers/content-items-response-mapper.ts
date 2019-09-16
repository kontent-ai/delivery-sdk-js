import { IBaseResponse } from '@kentico/kontent-core';

import { ContentItemContracts } from '../contracts';
import { ContentItemModels } from '../models';
import { ContentItemResponses } from '../responses';
import { BaseMapper } from './base-mapper';

export class ContentItemsResponseMapper extends BaseMapper {

    mapListingItemsResponse(
        response: IBaseResponse<ContentItemContracts.IContentItemsListingResponseContract>
    ): ContentItemResponses.ContentItemsResponse {

        const pagination = super.mapPagination(response.data.pagination);
        const items = response.data.items.map(m => this.mapContentItem(m));

        return new ContentItemResponses.ContentItemsResponse(super.mapResponseDebug(response), response.data, {
            pagination: pagination,
            items: items
        });
    }

    mapViewContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IContentItemModelContract>
    ): ContentItemResponses.ViewContentItemResponse {
        return new ContentItemResponses.ViewContentItemResponse(super.mapResponseDebug(response), response.data, this.mapContentItem(response.data));
    }

    mapAddContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IAddContentItemResponseContract>
    ): ContentItemResponses.AddContentItemResponse {
        return new ContentItemResponses.AddContentItemResponse(super.mapResponseDebug(response), response.data, this.mapContentItem(response.data));
    }

    mapUpdateContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IUpdateContentItemResponseContract>
    ): ContentItemResponses.UpdateContentItemResponse {
        return new ContentItemResponses.UpdateContentItemResponse(super.mapResponseDebug(response), response.data, this.mapContentItem(response.data));
    }

    mapUpsertContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IUpsertContentItemResponseContract>
    ): ContentItemResponses.UpsertContentItemResponse {
        return new ContentItemResponses.UpsertContentItemResponse(super.mapResponseDebug(response), response.data, this.mapContentItem(response.data));
    }

    mapDeleteContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IDeleteContentItemResponseContract>
    ): ContentItemResponses.DeleteContentItemResponse {
        return new ContentItemResponses.DeleteContentItemResponse(super.mapResponseDebug(response), response.data);
    }

    private mapContentItem(rawItem: ContentItemContracts.IContentItemModelContract): ContentItemModels.ContentItem {
        return new ContentItemModels.ContentItem({
            codename: rawItem.codename,
            externalId: rawItem.external_id,
            id: rawItem.id,
            lastModified: new Date(rawItem.last_modified),
            name: rawItem.name,
            sitemapLocations: rawItem.sitemap_locations,
            type: rawItem.type
        });
    }
}

export const contentItemsResponseMapper = new ContentItemsResponseMapper();
