import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { ElementResponses } from '../../models';
import { QueryService } from '../../services';
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
    getObservable(): Observable<ElementResponses.ElementResponse> {
        return super.runElementQuery(this.typeCodename, this.elementCodename);
    }

    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string {
        return super.getElementQueryUrl(this.typeCodename, this.elementCodename);
    }
}
