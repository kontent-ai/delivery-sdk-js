import { IItem } from '../interfaces/iitem.interface';
import { TypeResolverService } from './type-resolver.service';
export declare class FieldMapService {
    private typeResolverService;
    constructor(typeResolverService: TypeResolverService);
    mapFields(item: IItem, modularContent: any): any;
    private mapField(field, modularContent);
    private mapRichTextField(field, modularContent);
    private mapDateTimeField(field);
    private mapMultipleChoiceField(field);
    private mapNumberField(field);
    private mapTextField(field);
    private mapAssetsField(field);
    private mapModularField(field, modularContent);
}
