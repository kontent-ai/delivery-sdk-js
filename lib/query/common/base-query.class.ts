// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// services
import { QueryService } from '../../services/query.service';

export abstract class BaseQuery extends QueryService {

    constructor(
        protected config: DeliveryClientConfig,
    ) {
        super(config)
    }

    abstract toString(): string;
    abstract get(): any;
}