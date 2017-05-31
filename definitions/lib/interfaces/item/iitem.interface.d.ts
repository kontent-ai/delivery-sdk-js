import { ISystemItem } from './isystem-item.interface';
export interface IItem {
    system: ISystemItem;
    elements: any;
    resolver?: ((fieldName: string) => string);
}
