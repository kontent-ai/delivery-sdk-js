import { IBaseResponse } from 'kentico-cloud-core';

import { SharedContracts } from '../contracts';
import { ReferenceModel } from '../models';
import { BaseResponses, SharedResponses } from '../responses';

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

    mapReference(rawReference: SharedContracts.IReferenceObjectContract): ReferenceModel {
        return new ReferenceModel({
            codename: rawReference.codename,
            externalId: rawReference.external_id,
            id: rawReference.id
        });
    }
}

export const baseMapper = new BaseMapper();
