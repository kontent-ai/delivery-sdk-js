import {
  DeliveryClient, TypeResolver, DeliveryClientConfig
} from '../../lib';

export class Context {
  public typeResolvers?: TypeResolver[];
  public projectId?: string;
  public previewApiKey?: string;
  public securedApiKey?: string;
  public deliveryClient?: DeliveryClient;
  public usePreviewMode: boolean = false;
  public useSecuredMode: boolean = false;
  public defaultLanguage?: string;
  public baseUrl?: string;
  public basePreviewUrl?: string;

  constructor(
    options?: {
      typeResolvers?: TypeResolver[],
      projectId?: string,
      previewApiKey?: string,
      deliveryClient?: DeliveryClient,
      usePreviewMode?: boolean,
      defaultLanguage?: string,
      baseUrl?: string,
      basePreviewUrl?: string,
      securedApiKey?: string,
      useSecuredMode?: boolean
    }
  ) {
    if (options) {
      Object.assign(this, options);
    }
  }

  getConfig(): DeliveryClientConfig {
    return new DeliveryClientConfig(
      this.projectId,
      this.typeResolvers,
      {
        enableAdvancedLogging: true,
        enablePreviewMode: this.usePreviewMode,
        previewApiKey: this.previewApiKey,
        defaultLanguage: this.defaultLanguage,
        baseUrl:  this.baseUrl,
        basePreviewUrl: this.basePreviewUrl,
        enableSecuredMode: this.useSecuredMode,
        securedApiKey: this.securedApiKey
      }
    );
  }
}
