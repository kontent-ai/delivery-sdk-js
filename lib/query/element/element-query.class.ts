import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config/delivery-client.config';
import { ElementResponses } from '../../models/element/responses';
import { QueryService } from '../../services/query.service';
import { BaseElementQuery } from './base-element-query.class';

export class ElementQuery extends BaseElementQuery<ElementResponses.ElementResponse> {

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService,
        private typeCodename: string,
        private elementCodename: string
    ) {
        super(config, queryService);

        if (!typeCodename) {
            throw Error(`Codename of the type has to be provided`);
        }

        if (!elementCodename) {
            throw Error(`Codename of the element has to be provided`);
        }
    }

    /**
    * Gets the runnable Observable
    */
    get(): Observable<ElementResponses.ElementResponse> {
        return super.runElementQuery(this.typeCodename, this.elementCodename);
    }

    /**
    * Gets 'Url' representation of query
    */
    toString(): string {
        return super.getElementQueryUrl(this.typeCodename, this.elementCodename);
    }
}
