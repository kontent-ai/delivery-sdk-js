import { IBaseResponse } from 'kentico-cloud-core';

import { IContentItemModelContract, IContentItemsListingResponseContract } from '../contracts';
import { ContentItemModel, ContentItemsResponse, ViewContentItemResponse } from '../responses';
import { baseMapper } from './base-mapper';

export class ContentItemsResponseMapper {

    mapListingItemsResponse(
        response: IBaseResponse<IContentItemsListingResponseContract>
    ): ContentItemsResponse {

        const pagination = baseMapper.mapPagination(response.data.pagination);
        const items = response.data.items.map(m => new ContentItemModel({
            codename: m.codename,
            externalId: m.external_id,
            id: m.id,
            lastModified: new Date(m.last_modified),
            name: m.name,
            sitemapLocations: m.sitemap_locations,
            type: m.type
        })
        );

        return new ContentItemsResponse(baseMapper.mapResponseDebug(response), response.data, {
            pagination: pagination,
            items: items
        });
    }

    mapViewContentItemResponse(
        response: IBaseResponse<IContentItemModelContract>
    ): ViewContentItemResponse {
        const item = new ContentItemModel({
            codename: response.data.codename,
            externalId: response.data.external_id,
            id: response.data.id,
            lastModified: new Date(response.data.last_modified),
            name: response.data.name,
            sitemapLocations: response.data.sitemap_locations,
            type: response.data.type
        });
        return new ViewContentItemResponse(baseMapper.mapResponseDebug(response), response.data, item);
    }
}

export const contentItemsResponseMapper = new ContentItemsResponseMapper();
