import { IBaseResponse } from 'kentico-cloud-core';

import { ContentItemContracts } from '../contracts';
import { ContentItemResponses } from '../responses';
import { baseMapper } from './base-mapper';

export class ContentItemsResponseMapper {

    mapListingItemsResponse(
        response: IBaseResponse<ContentItemContracts.IContentItemsListingResponseContract>
    ): ContentItemResponses.ContentItemsResponse {

        const pagination = baseMapper.mapPagination(response.data.pagination);
        const items = response.data.items.map(m => this.mapContentItem(m));

        return new ContentItemResponses.ContentItemsResponse(baseMapper.mapResponseDebug(response), response.data, {
            pagination: pagination,
            items: items
        });
    }

    mapViewContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IContentItemModelContract>
    ): ContentItemResponses.ViewContentItemResponse {
        return new ContentItemResponses.ViewContentItemResponse(baseMapper.mapResponseDebug(response), response.data, this.mapContentItem(response.data));
    }

    mapAddContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IAddContentItemResponseContract>
    ): ContentItemResponses.AddContentItemResponse {
        return new ContentItemResponses.AddContentItemResponse(baseMapper.mapResponseDebug(response), response.data, this.mapContentItem(response.data));
    }

    mapUpdateContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IUpdateContentItemResponseContract>
    ): ContentItemResponses.UpdateContentItemResponse {
        return new ContentItemResponses.UpdateContentItemResponse(baseMapper.mapResponseDebug(response), response.data, this.mapContentItem(response.data));
    }

    mapDeleteContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IDeleteContentItemResponseContract>
    ): ContentItemResponses.DeleteContentItemResponse {
        return new ContentItemResponses.DeleteContentItemResponse(baseMapper.mapResponseDebug(response), response.data);
    }

    mapLanguageVariantsResponse(
        response: IBaseResponse<ContentItemContracts.IListLanguageVariantsResponseContract[]>
    ): ContentItemResponses.ListLanguageVariantsResponse {
        const variants = response.data.map(m => this.mapLanguageVariant(m));
        return new ContentItemResponses.ListLanguageVariantsResponse(baseMapper.mapResponseDebug(response), response.data, {
            variants: variants
        });
    }

    private mapLanguageVariant(rawVariant: ContentItemContracts.ILanguageVariantModelContract): ContentItemResponses.ContentItemLanguageVariant {
        return new ContentItemResponses.ContentItemLanguageVariant({
            elements: rawVariant.elements,
            item: baseMapper.mapReference(rawVariant.item),
            language: baseMapper.mapReference(rawVariant.language),
            lastModified: new Date(rawVariant.last_modified)
        });
    }

    private mapContentItem(rawItem: ContentItemContracts.IContentItemModelContract): ContentItemResponses.ContentItemModel {
        return new ContentItemResponses.ContentItemModel({
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
