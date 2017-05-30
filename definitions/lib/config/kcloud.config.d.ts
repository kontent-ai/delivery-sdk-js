import { TypeResolver } from '../models/type-resolver.class';
export declare class KCloudConfig {
    apiEndpoint: string;
    projectId: string;
    typeResolvers: TypeResolver[];
    options: {
        option1?: boolean;
    };
    option1: boolean;
    constructor(apiEndpoint: string, projectId: string, typeResolvers: TypeResolver[], options?: {
        option1?: boolean;
    });
}
