// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';
import { Observable } from 'rxjs/Rx';

// services
import { QueryService } from '../../services/query.service';
import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';

export abstract class BaseQuery<TResponse> {

    protected parameters: IQueryParameter[] = [];

    constructor(
        protected config: DeliveryClientConfig,
        protected queryService: QueryService
    ) {
    }

    abstract toString(): string;
    abstract get(): Observable<TResponse>;

    getParameters(): IQueryParameter[] {
        return this.parameters;
    }

    getPromise(): Promise<TResponse> {
        this.getParameters().find(m => m.getParam() === 'language')
        return this.get().toPromise();
    }
}
