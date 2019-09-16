import { ContentTypeSnippetContracts } from '../../contracts';
import { ContentTypeModels, SharedModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace ContentTypeSnippetResponses {

    export class ContentTypeSnippetListResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeSnippetContracts.IContentTypeSnippetListResponseContract,
        {
            types: ContentTypeModels.ContentType[],
            pagination: SharedModels.Pagination
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeSnippetContracts.IContentTypeSnippetListResponseContract,
            data: {
                types: ContentTypeModels.ContentType[],
                pagination: SharedModels.Pagination
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class ViewContentTypeSnippetResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeSnippetContracts.IViewContentTypeSnippetResponseContract, ContentTypeModels.ContentType>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeSnippetContracts.IViewContentTypeSnippetResponseContract,
            data: ContentTypeModels.ContentType
        ) {
            super(debug, rawData, data);
        }
    }

    export class AddContentTypeSnippetResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeSnippetContracts.IAddContentTypeSnippetResponseContract, ContentTypeModels.ContentType>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeSnippetContracts.IAddContentTypeSnippetResponseContract,
            data: ContentTypeModels.ContentType
        ) {
            super(debug, rawData, data);
        }
    }

    export class DeleteContentTypeSnippetResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeSnippetContracts.IDeleteContentTypeSnippetResponseContract, undefined>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeSnippetContracts.IDeleteContentTypeSnippetResponseContract,
            data: undefined
        ) {
            super(debug, rawData, data);
        }
    }
}

