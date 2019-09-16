import { IBaseResponse } from '@kentico/kontent-core';

import { SharedContracts } from '../contracts';
import { SharedModels } from '../models';
import { BaseResponses } from '../responses';

export abstract class BaseMapper {

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

    mapPagination(rawPagination: SharedContracts.IPaginationModelContract): SharedModels.Pagination {
        return new SharedModels.Pagination(rawPagination.continuation_token, rawPagination.next_page);
    }

    mapReference(rawReference: SharedContracts.IReferenceObjectContract): SharedModels.ReferenceObject {
        return new SharedModels.ReferenceObject({
            codename: rawReference.codename,
            externalId: rawReference.external_id,
            id: rawReference.id
        });
    }

    mapEmptyResponse(response: IBaseResponse<void | any>): BaseResponses.EmptyContentManagementResponse {
        if (response.data) {
            throw Error(`Expected response to be empty`);
        }
        return new BaseResponses.EmptyContentManagementResponse(this.mapResponseDebug(response), undefined, undefined);
    }
}

