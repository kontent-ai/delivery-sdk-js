import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { ICloudResponse, IQueryParameter, IQueryConfig } from '../../interfaces';
import { QueryService } from '../../services';

export abstract class BaseQuery<TResponse extends ICloudResponse> {

    protected parameters: IQueryParameter[] = [];
    protected customUrl?: string;

    protected abstract _queryConfig: IQueryConfig;

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService
    ) {
    }

    abstract getUrl(): string;
    abstract getObservable(): Observable<TResponse>;

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
        return this.queryService.getUrl(action, this._queryConfig, this.getParameters());
    }
}
