import { DeliveryClient, IDeliveryClientConfig, TypeResolver } from '../../lib';
import { IRichTextHtmlParser } from '../../lib/parser/parse-models';
import { getParserAdapter } from '../../lib/parser/parser-adapter';
import { IHeader } from 'kentico-cloud-core';

export class Context {

  /**
   * Use browser version of html parser when running tests in browser
   */
  public richTextHtmlParser?: IRichTextHtmlParser = getParserAdapter();

  public typeResolvers!: TypeResolver[];
  public projectId!: string;
  public previewApiKey?: string;
  public securedApiKey?: string;
  public deliveryClient!: DeliveryClient;
  public usePreviewMode: boolean = false;
  public useSecuredMode: boolean = false;
  public defaultLanguage?: string;
  public baseUrl?: string;
  public basePreviewUrl?: string;
  public retryAttempts?: number;
  public enableAdvancedLogging?: boolean;
  public globalHeaders?: IHeader[];
  public retryStatusCodes?: number[];

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
      useSecuredMode?: boolean,
      retryAttempts?: number,
      enableAdvancedLogging?: boolean,
      globalHeaders?: IHeader[],
      retryStatusCodes?: number[];
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
      enableAdvancedLogging: this.enableAdvancedLogging,
      enablePreviewMode: this.usePreviewMode,
      previewApiKey: this.previewApiKey,
      defaultLanguage: this.defaultLanguage,
      baseUrl: this.baseUrl,
      basePreviewUrl: this.basePreviewUrl,
      enableSecuredMode: this.useSecuredMode,
      securedApiKey: this.securedApiKey,
      retryAttempts: this.retryAttempts,
      globalHeaders: this.globalHeaders,
      retryStatusCodes: this.retryStatusCodes
    };
  }
}
