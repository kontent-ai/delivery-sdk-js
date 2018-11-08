import { IBaseResponse } from 'kentico-cloud-core';

import { ContentItemContracts } from '../contracts';
import { ContentItemResponses } from '../responses';
import { baseMapper } from './base-mapper';

export class ContentItemsResponseMapper {

    mapListingItemsResponse(
        response: IBaseResponse<ContentItemContracts.IContentItemsListingResponseContract>
    ): ContentItemResponses.ContentItemsResponse {

        const pagination = baseMapper.mapPagination(response.data.pagination);
        const items = response.data.items.map(m => new ContentItemResponses.ContentItemModel({
            codename: m.codename,
            externalId: m.external_id,
            id: m.id,
            lastModified: new Date(m.last_modified),
            name: m.name,
            sitemapLocations: m.sitemap_locations,
            type: m.type
        })
        );

        return new ContentItemResponses.ContentItemsResponse(baseMapper.mapResponseDebug(response), response.data, {
            pagination: pagination,
            items: items
        });
    }

    mapViewContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IContentItemModelContract>
    ): ContentItemResponses.ViewContentItemResponse {
        const item = new ContentItemResponses.ContentItemModel({
            codename: response.data.codename,
            externalId: response.data.external_id,
            id: response.data.id,
            lastModified: new Date(response.data.last_modified),
            name: response.data.name,
            sitemapLocations: response.data.sitemap_locations,
            type: response.data.type
        });
        return new ContentItemResponses.ViewContentItemResponse(baseMapper.mapResponseDebug(response), response.data, item);
    }

    mapAddContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IAddContentItemResponseContract>
    ): ContentItemResponses.AddContentItemResponse {
        const item = new ContentItemResponses.ContentItemModel({
            codename: response.data.codename,
            externalId: response.data.external_id,
            id: response.data.id,
            lastModified: new Date(response.data.last_modified),
            name: response.data.name,
            sitemapLocations: response.data.sitemap_locations,
            type: response.data.type
        });
        return new ContentItemResponses.AddContentItemResponse(baseMapper.mapResponseDebug(response), response.data, item);
    }
}

export const contentItemsResponseMapper = new ContentItemsResponseMapper();
