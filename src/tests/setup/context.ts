import {
  DeliveryClient, DeliveryItemResponse, DeliveryItemListingResponse, TypeResolver
} from '../../../lib';

export class Context {
  public typeResolvers: TypeResolver[];
  public projectId: string;
  public previewApiKey: string;
  public deliveryClient: DeliveryClient;
  public usePreviewMode: boolean;

  constructor(
    options?: {
      typeResolvers: TypeResolver[],
      projectId: string,
      previewApiKey: string,
      deliveryClient: DeliveryClient,
      usePreviewMode: boolean
    }
  ) {
    if (options) {
      Object.assign(this, options);
    }
  }
}