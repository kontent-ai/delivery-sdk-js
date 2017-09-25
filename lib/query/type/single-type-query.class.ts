// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { TypeResponses } from '../../models/type/responses';

// query params
import  { Parameters } from '../../models/common/parameters';

// base query
import { BaseTypeQuery } from './base-type-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

export class SingleTypeQuery extends BaseTypeQuery {

    constructor(
        protected config: DeliveryClientConfig,
        private typeCodename: string
    ) {
        super(config)

           if (!typeCodename){
            throw Error(`'typeCodename' cannot be null for 'SingleTypeQuery' query`);
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