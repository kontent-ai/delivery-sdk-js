import { TypeContracts } from '../data-contracts';
import { ContentType } from '../models';
export declare class TypeMapper {
    mapSingleType(response: TypeContracts.IViewContentTypeContract): ContentType;
    mapMultipleTypes(response: TypeContracts.IListContentTypeContract): ContentType[];
    private mapType;
}
