import { IBaseResponse } from 'kentico-cloud-core';

import {
  ITrackingCloudResponseDebug,
  TrackingEmptySuccessResponse
} from '../models';

export class TrackingResponseMapper {
  mapEmptyTrackingSuccessResponse(
    response: IBaseResponse
  ): TrackingEmptySuccessResponse {
    return new TrackingEmptySuccessResponse(this.mapResponseDebug(response));
  }

  private mapResponseDebug(
    baseResponse: IBaseResponse
  ): ITrackingCloudResponseDebug {
    if (!baseResponse) {
      throw Error(`Cannot map 'debug' model from the response`);
    }

    return {
      response: baseResponse.response
    };
  }
}

export const trackingResponseMapper = new TrackingResponseMapper();
