// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';
import { Observable } from 'rxjs/Rx';

// services
import { QueryService } from '../../services/query.service';

export abstract class BaseQuery<TResponse> {

    constructor(
        protected config: DeliveryClientConfig,
        protected queryService: QueryService
    ) {
    }

    abstract toString(): string;
    abstract get(): Observable<TResponse>;

    getPromise(): Promise<TResponse> {
        return this.get().toPromise();
    }
}
