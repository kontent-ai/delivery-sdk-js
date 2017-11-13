// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { TypeResponses } from '../../models/type/responses';

// query params
import { Parameters } from '../../models/common/parameters';

// base query
import { BaseTypeQuery } from './base-type-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

// services
import { QueryService } from '../../services/query.service';

export class SingleTypeQuery extends BaseTypeQuery {

    constructor(
        protected config: DeliveryClientConfig,
        protected queryService: QueryService,
        private typeCodename: string
    ) {
        super(config, queryService)

           if (!typeCodename) {
            throw Error(`Cannot create type query without the codename of the type`);
        }
    }

     /**
     * Gets the runnable Observable
     */
    get(): Observable<TypeResponses.DeliveryTypeResponse> {
        return super.runSingleTypeQuery(this.typeCodename)
    }

     /**
     * Gets 'Url' representation of query
     */
    toString(): string {
        return super.getSingleTypeQueryUrl(this.typeCodename);
    }
}
