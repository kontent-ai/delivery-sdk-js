import { IQueryParameter, Parameters } from 'kentico-cloud-core';
import { Observable } from 'rxjs';

import { ITrackingClientConfig } from '../config/itracking-client-config.interface';
import { ITrackingCloudResponse, ITrackingQueryConfig } from '../models';
import { TrackingQueryService } from '../services';

export abstract class BaseQuery<TResponse extends ITrackingCloudResponse> {

    protected _queryConfig?: ITrackingQueryConfig;
    protected parameters: IQueryParameter[] = [];
    protected customUrl?: string;

    constructor(
        protected config: ITrackingClientConfig,
        protected queryService: TrackingQueryService
    ) {
    }

    abstract getUrl(): string;
    abstract getObservable(): Observable<TResponse>;

    queryConfig(config: ITrackingQueryConfig): this {
        this._queryConfig = config;
        return this;
    }

    customParameter(name: string, value: string): this {
        this.parameters.push(new Parameters.CustomParameter(name, value));
        return this;
    }

    withUrl(url: string): this {
        this.customUrl = url;
        return this;
    }

    getParameters(): IQueryParameter[] {
        return this.parameters;
    }

    getPromise(): Promise<TResponse> {
        return this.getObservable().toPromise();
    }

    protected resolveUrlInternal(action: string): string {
        // use custom URL if user specified it
        if (this.customUrl) {
            return this.customUrl;
        }

        // use original url
        return this.queryService.getUrl(action, this.getParameters());
    }
}
