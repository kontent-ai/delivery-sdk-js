// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// services
import { QueryService } from '../../services/query.service';

export abstract class BaseQuery {

    constructor(
        protected config: DeliveryClientConfig,
        protected queryService: QueryService
    ) {
    }

    abstract toString(): string;
    abstract get(): any;
}
