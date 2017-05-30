import { TypeResolver } from '../models/item/type-resolver.class';

export class DeliveryClientConfig {
    public logErrorsToConsole: boolean = true;

    constructor(
        public apiEndpoint: string,
        public projectId: string,
        public typeResolvers: TypeResolver[],
        public options?: {
            logErrorsToConsole?: boolean
        }) {
        if (options) Object.assign(this, options);
    }
}