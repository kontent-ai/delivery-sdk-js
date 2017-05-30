import { IItem } from '../interfaces/iitem.interface';
import { ISystem } from '../interfaces/isystem.interface';
export declare abstract class BaseItem implements IItem {
    options: {
        resolver?: ((fieldName: string) => string);
    };
    system: ISystem;
    elements: any;
    resolver?: ((fieldName: string) => string);
    constructor(options?: {
        resolver?: ((fieldName: string) => string);
    });
}
