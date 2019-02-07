import { ContentTypeContracts } from '../../contracts';
import { ContentTypeModels, SharedModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace ContentTypeResponses {

    export class ContentTypeListResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeContracts.IContentTypeListResponseContract,
        {
            types: ContentTypeModels.ContentType[],
            pagination: SharedModels.Pagination
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeContracts.IContentTypeListResponseContract,
            data: {
                types: ContentTypeModels.ContentType[],
                pagination: SharedModels.Pagination
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class ViewContentTypeResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeContracts.IViewContentTypeResponseContract, ContentTypeModels.ContentType>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeContracts.IViewContentTypeResponseContract,
            data: ContentTypeModels.ContentType
        ) {
            super(debug, rawData, data);
        }
    }

    export class AddContentTypeResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeContracts.IAddContentTypeResponseContract, ContentTypeModels.ContentType>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeContracts.IAddContentTypeResponseContract,
            data: ContentTypeModels.ContentType
        ) {
            super(debug, rawData, data);
        }
    }

    export class DeleteContentTypeResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeContracts.IDeleteContentTypeResponseContract, undefined>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeContracts.IDeleteContentTypeResponseContract,
            data: undefined
        ) {
            super(debug, rawData, data);
        }
    }
}

