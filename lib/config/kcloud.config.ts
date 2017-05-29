import { TypeResolver } from '../models/type-resolver.class';

export class KCloudConfig {
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