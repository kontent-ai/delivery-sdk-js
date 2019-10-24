import { DeliveryClient, IDeliveryClientConfig, TypeResolver, IQueryConfig } from '../../lib';
import { IRichTextHtmlParser } from '../../lib/parser/parse-models';
import { getParserAdapter } from '../../lib/parser/parser-adapter';
import { IHeader, IRetryStrategyOptions } from '@kentico/kontent-core';

export class Context {

  public deliveryClient!: DeliveryClient;

  /**
   * Use browser version of html parser when running tests in browser
   */
  public richTextHtmlParser?: IRichTextHtmlParser = getParserAdapter();

  public globalQueryConfig?: IQueryConfig;
  public typeResolvers!: TypeResolver[];
  public projectId!: string;
  public previewApiKey?: string;
  public securedApiKey?: string;
  public usePreviewMode: boolean = false;
  public useSecuredMode: boolean = false;
  public defaultLanguage?: string;
  public baseUrl?: string;
  public basePreviewUrl?: string;
  public isDeveloperMode?: boolean = true;
  public globalHeaders?: (queryConfig: IQueryConfig) => IHeader[];
  public retryStrategy?: IRetryStrategyOptions;

  constructor(
    options?: {
      globalQueryConfig?: IQueryConfig;
      typeResolvers?: TypeResolver[],
      projectId?: string,
      previewApiKey?: string,
      deliveryClient?: DeliveryClient,
      defaultLanguage?: string,
      baseUrl?: string,
      basePreviewUrl?: string,
      securedApiKey?: string,
      isDeveloperMode?: boolean,
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
      projectId: this.projectId,
      typeResolvers: this.typeResolvers,
      isDeveloperMode: this.isDeveloperMode,
      previewApiKey: this.previewApiKey,
      secureApiKey: this.securedApiKey,
      globalQueryConfig: this.globalQueryConfig,
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
