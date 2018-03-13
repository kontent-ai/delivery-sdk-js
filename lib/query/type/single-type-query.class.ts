import { Observable } from 'rxjs/Observable';

import { DeliveryClientConfig } from '../../config/delivery-client.config';
import { TypeResponses } from '../../models/type/responses';
import { QueryService } from '../../services/query.service';
import { BaseTypeQuery } from './base-type-query.class';

export class SingleTypeQuery extends BaseTypeQuery<TypeResponses.DeliveryTypeResponse> {

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
