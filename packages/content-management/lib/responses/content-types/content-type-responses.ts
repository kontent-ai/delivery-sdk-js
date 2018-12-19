import { ContentTypeContracts } from '../../contracts';
import { ContentTypeModels, SharedModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace ContentTypeResponses {

    export class ContentTypeListResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeContracts.IContentTypeListResponse,
        {
            types: ContentTypeModels.ContentType[],
            pagination: SharedModels.Pagination
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeContracts.IContentTypeListResponse,
            data: {
                types: ContentTypeModels.ContentType[],
                pagination: SharedModels.Pagination
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class ViewContentTypeResponse extends BaseResponses.BaseContentManagementResponse<ContentTypeContracts.IViewContentTypeResponse, ContentTypeModels.ContentType>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentTypeContracts.IViewContentTypeResponse,
            data: ContentTypeModels.ContentType
        ) {
            super(debug, rawData, data);
        }
    }
}

