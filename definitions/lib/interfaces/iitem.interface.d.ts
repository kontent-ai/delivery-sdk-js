import { ISystem } from './isystem.interface';
export interface IItem {
    system: ISystem;
    elements: any;
    resolver?: ((fieldName: string) => string);
}
