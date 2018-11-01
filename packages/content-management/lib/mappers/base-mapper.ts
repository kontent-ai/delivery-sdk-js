import { IBaseResponse } from 'kentico-cloud-core';

import { IPaginationModelContract } from '../contracts';
import { IContentManagementResponseDebug, PaginationModel } from '../responses';

export class BaseMapper {

    mapResponseDebug(
        baseResponse: IBaseResponse<any>
    ): IContentManagementResponseDebug {
        if (!baseResponse) {
            throw Error(`Cannot map debug model from the response`);
        }

        return {
            response: baseResponse.response
        };
    }

    mapPagination(rawPagination: IPaginationModelContract): PaginationModel {
        return new PaginationModel(rawPagination.continuation_token, rawPagination.next_page);
    }
}


export const baseMapper = new BaseMapper();
