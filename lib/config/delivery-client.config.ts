import { TypeResolver } from '../models/item/type-resolver.class';

export class DeliveryClientConfig {
    public option1: boolean = true;

    constructor(
        public apiEndpoint: string,
        public projectId: string,
        public typeResolvers: TypeResolver[],
        public options?: {
            option1?: boolean
        }) {
        if (options) Object.assign(this, options);
    }
}