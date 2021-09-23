import { DeliveryClient, IDeliveryClientConfig, IQueryConfig, PropertyNameResolver } from '../../../lib';
import { IHeader, IRetryStrategyOptions } from '@kentico/kontent-core';

export class Context {

  public deliveryClient!: DeliveryClient;

  public defaultQueryConfig?: IQueryConfig;
  public propertyNameResolver?: PropertyNameResolver;
  public projectId!: string;
  public previewApiKey?: string;
  public securedApiKey?: string;
  public usePreviewMode: boolean = false;
  public useSecuredMode: boolean = false;
  public defaultLanguage?: string;
  public baseUrl?: string;
  public basePreviewUrl?: string;
  public globalHeaders?: (queryConfig: IQueryConfig) => IHeader[];
  public retryStrategy?: IRetryStrategyOptions;

  constructor(
    options?: {
      propertyNameResolver?: PropertyNameResolver;
      defaultQueryConfig?: IQueryConfig;
      projectId?: string,
      previewApiKey?: string,
      deliveryClient?: DeliveryClient,
      defaultLanguage?: string,
      baseUrl?: string,
      basePreviewUrl?: string,
      securedApiKey?: string,
      globalHeaders?: (queryConfig: IQueryConfig) => IHeader[],
      retryStrategy?: IRetryStrategyOptions;
    }
  ) {
    if (options) {
      Object.assign(this, options);
    }
  }

  getConfig(): IDeliveryClientConfig {
    return {
      propertyNameResolver: this.propertyNameResolver,
      projectId: this.projectId,
      previewApiKey: this.previewApiKey,
      secureApiKey: this.securedApiKey,
      defaultQueryConfig: this.defaultQueryConfig,
      proxy: {
        baseUrl: this.baseUrl,
        basePreviewUrl: this.basePreviewUrl
      },
      defaultLanguage: this.defaultLanguage,
      globalHeaders: this.globalHeaders,
      retryStrategy: this.retryStrategy,
    };
  }
}
