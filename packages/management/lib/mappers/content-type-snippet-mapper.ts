import { IBaseResponse } from '@kentico/kontent-core';

import { ContentTypeSnippetContracts } from '../contracts';
import { ContentTypeSnippetModels } from '../models';
import { ContentTypeSnippetResponses } from '../responses';
import { BaseMapper } from './base-mapper';
import { elementsMapper } from './elements-mapper';

export class ContentTypeSnippetMapper extends BaseMapper {

    mapListingResponse(response: IBaseResponse<ContentTypeSnippetContracts.IContentTypeSnippetListResponseContract>): ContentTypeSnippetResponses.ContentTypeSnippetListResponse {
        return new ContentTypeSnippetResponses.ContentTypeSnippetListResponse(
            super.mapResponseDebug(response), response.data, {
                types: response.data.snippets.map(m => this.mapContentTypeSnippet(m)),
                pagination: super.mapPagination(response.data.pagination)
            }
        );
    }

    mapViewContentTypeSnippetResponse(response: IBaseResponse<ContentTypeSnippetContracts.IViewContentTypeSnippetResponseContract>): ContentTypeSnippetResponses.ViewContentTypeSnippetResponse {
        return new ContentTypeSnippetResponses.ViewContentTypeSnippetResponse(
            super.mapResponseDebug(response), response.data, this.mapContentTypeSnippet(response.data)
        );
    }

    mapAddContentTypeSnippetResponse(response: IBaseResponse<ContentTypeSnippetContracts.IAddContentTypeSnippetResponseContract>): ContentTypeSnippetResponses.AddContentTypeSnippetResponse {
        return new ContentTypeSnippetResponses.AddContentTypeSnippetResponse(
            super.mapResponseDebug(response), response.data, this.mapContentTypeSnippet(response.data)
        );
    }

    mapDeleteContentTypeSnippetRespose(response: IBaseResponse<ContentTypeSnippetContracts.IDeleteContentTypeSnippetResponseContract>): ContentTypeSnippetResponses.DeleteContentTypeSnippetResponse {
        return new ContentTypeSnippetResponses.DeleteContentTypeSnippetResponse(
            super.mapResponseDebug(response), response.data, undefined
        );
    }

    private mapContentTypeSnippet(rawContentType: ContentTypeSnippetContracts.IContentTypeSnippetContract): ContentTypeSnippetModels.ContentTypeSnippet {
        return new ContentTypeSnippetModels.ContentTypeSnippet({
            codename: rawContentType.codename,
            id: rawContentType.id,
            name: rawContentType.name,
            elements: elementsMapper.mapTypeElements(rawContentType.elements),
            lastModified: new Date(rawContentType.last_modified)
        });
    }

}

export const contentTypeSnippetMapper = new ContentTypeSnippetMapper();
