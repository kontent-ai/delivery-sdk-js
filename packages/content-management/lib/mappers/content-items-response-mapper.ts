import { IBaseResponse } from 'kentico-cloud-core';

import { ContentItemContracts } from '../contracts';
import { ContentItemElements, ContentItemModels } from '../models';
import { ContentItemResponses } from '../responses';
import { BaseMapper } from './base-mapper';
import { elementsMapper } from './elements-mapper';

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

    mapDeleteContentItemResponse(
        response: IBaseResponse<ContentItemContracts.IDeleteContentItemResponseContract>
    ): ContentItemResponses.DeleteContentItemResponse {
        return new ContentItemResponses.DeleteContentItemResponse(super.mapResponseDebug(response), response.data);
    }

    mapLanguageVariantsResponse<TElements extends ContentItemModels.ContentItemVariantElements>(
        response: IBaseResponse<ContentItemContracts.IListLanguageVariantsResponseContract[]>,
        fieldDefinitions: ContentItemElements.IContentItemElementDefinition[],
        createElements: () => TElements
    ): ContentItemResponses.ListLanguageVariantsResponse<TElements> {
        const variants = response.data.map(m => this.mapLanguageVariant(m, fieldDefinitions, createElements));
        return new ContentItemResponses.ListLanguageVariantsResponse(super.mapResponseDebug(response), response.data, {
            variants: variants
        });
    }

    private mapLanguageVariant<TElements extends ContentItemModels.ContentItemVariantElements>
        (rawVariant: ContentItemContracts.ILanguageVariantModelContract, fieldDefinitions: ContentItemElements.IContentItemElementDefinition[], createElements: () => TElements): ContentItemModels.ContentItemLanguageVariant<TElements> {

        return new ContentItemModels.ContentItemLanguageVariant({
            rawElements: rawVariant.elements,
            elements: elementsMapper.mapElements<TElements>(rawVariant.elements, fieldDefinitions, createElements()),
            item: super.mapReference(rawVariant.item),
            language: super.mapReference(rawVariant.language),
            lastModified: new Date(rawVariant.last_modified)
        });
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
