import { IBaseResponse } from 'kentico-cloud-core';

import { SharedContracts } from '../contracts';
import { ReferenceModel, SharedModels } from '../models';
import { BaseResponses } from '../responses';

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

    mapPagination(rawPagination: SharedContracts.IPaginationModelContract): SharedModels.PaginationModel {
        return new SharedModels.PaginationModel(rawPagination.continuation_token, rawPagination.next_page);
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
