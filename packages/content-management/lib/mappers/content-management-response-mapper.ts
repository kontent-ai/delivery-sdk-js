import { IBaseResponse } from 'kentico-cloud-core';

import {
  IContentManagementResponseDebug,
  ContentItemsResponse
} from '../responses';

export class ContentManagementResponseMapper {
  mapListingItemsResponse(
    response: IBaseResponse
  ): ContentItemsResponse {
    return new ContentItemsResponse(this.mapResponseDebug(response), response.data);
  }

  private mapResponseDebug(
    baseResponse: IBaseResponse
  ): IContentManagementResponseDebug {
    if (!baseResponse) {
      throw Error(`Cannot map debug model from the response`);
    }

    return {
      response: baseResponse.response
    };
  }
}

export const contentManagementResponseMapper = new ContentManagementResponseMapper();
