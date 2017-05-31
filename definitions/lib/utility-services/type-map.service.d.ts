import { ICloudMultipleTypeResponse, ICloudSingleTypeResponse } from '../interfaces/type/cloud-responses';
import { Type } from '../models/type/type.class';
export declare class TypeMapService {
    constructor();
    private mapType(type);
    mapSingleType(response: ICloudSingleTypeResponse): Type;
    mapMultipleTypes(response: ICloudMultipleTypeResponse): Type[];
}
