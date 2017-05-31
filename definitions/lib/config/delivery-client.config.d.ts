import { TypeResolver } from '../models/item/type-resolver.class';
export declare class DeliveryClientConfig {
    apiEndpoint: string;
    projectId: string;
    typeResolvers: TypeResolver[];
    options: {
        logErrorsToConsole?: boolean;
    };
    logErrorsToConsole: boolean;
    constructor(apiEndpoint: string, projectId: string, typeResolvers: TypeResolver[], options?: {
        logErrorsToConsole?: boolean;
    });
}
