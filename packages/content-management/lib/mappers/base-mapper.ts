import { IBaseResponse } from 'kentico-cloud-core';

import { SharedContracts } from '../contracts';
import { BaseResponses, ContentItemResponses, SharedResponses } from '../responses';

export class BaseMapper {

    mapResponseDebug(
        baseResponse: IBaseResponse<any>
    ): BaseResponses.IContentManagementResponseDebug {
        if (!baseResponse) {
            throw Error(`Cannot map debug model from the response`);
        }

        return {
            response: baseResponse.response
        };
    }

    mapPagination(rawPagination: SharedContracts.IPaginationModelContract): SharedResponses.PaginationModel {
        return new SharedResponses.PaginationModel(rawPagination.continuation_token, rawPagination.next_page);
    }
}


export const baseMapper = new BaseMapper();
