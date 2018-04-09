import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { IQueryParameter } from '../../interfaces';
import { QueryService } from '../../services';

export abstract class BaseQuery<TResponse> {

    protected parameters: IQueryParameter[] = [];

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService
    ) {
    }

    abstract toString(): string;
    abstract get(): Observable<TResponse>;

    getParameters(): IQueryParameter[] {
        return this.parameters;
    }

    getPromise(): Promise<TResponse> {
        this.getParameters().find(m => m.getParam() === 'language');
        return this.get().toPromise();
    }
}
