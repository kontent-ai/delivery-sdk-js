import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { TypeResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseTypeQuery } from './base-type-query.class';

export class SingleTypeQuery extends BaseTypeQuery<TypeResponses.DeliveryTypeResponse> {

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService,
        private typeCodename: string
    ) {
        super(config, queryService);

        if (!typeCodename) {
            throw Error(`Cannot create type query without the codename of the type`);
        }
    }

    /**
    * Gets the runnable Observable
    */
    toObservable(): Observable<TypeResponses.DeliveryTypeResponse> {
        return super.runSingleTypeQuery(this.typeCodename);
    }

    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string {
        return super.getSingleTypeQueryUrl(this.typeCodename);
    }
}
