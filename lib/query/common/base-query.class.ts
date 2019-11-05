import { IHeader, IQueryParameter } from '@kentico/kontent-core';
import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { IKontentResponse, IQueryConfig, Parameters } from '../../models';
import { QueryService } from '../../services';

export abstract class BaseQuery<TResponse extends IKontentResponse<any>> {
  protected parameters: IQueryParameter[] = [];
  protected customUrl?: string;

  protected abstract _queryConfig: IQueryConfig;

  constructor(
    protected config: IDeliveryClientConfig,
    protected queryService: QueryService
  ) { }

  abstract getUrl(): string;
  abstract toObservable(): Observable<TResponse>;

  /**
   * Adds parameter to query
   * @param name Name of parameter
   * @param value Value of parameter
   */
  withParameter(name: string, value: string): this {
    this.parameters.push(new Parameters.QueryParameter(name, value));
    return this;
  }

  /**
   * Adds parameters to query
   * @param parameters Array of parameters
   */
  withParameters(parameters: IQueryParameter[]): this {
    this.parameters.push(...parameters);
    return this;
  }

  /**
   * Gets headers used by this query
   */
  getHeaders(): IHeader[] {
    return this.queryService.getHeaders(this._queryConfig);
  }

  withUrl(url: string): this {
    this.customUrl = url;
    return this;
  }

  getParameters(): IQueryParameter[] {
    return this.parameters;
  }

  toPromise(): Promise<TResponse> {
    return this.toObservable().toPromise();
  }

  protected resolveUrlInternal(action: string): string {
    // use custom URL if user specified it
    if (this.customUrl) {
      return this.customUrl;
    }

    // use original url
    return this.queryService.getUrl(
      action,
      this._queryConfig,
      this.getParameters()
    );
  }
}
