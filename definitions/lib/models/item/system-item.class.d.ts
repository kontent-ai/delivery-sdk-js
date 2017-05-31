import { ISystemItem } from '../../interfaces/item/isystem-item.interface';
export declare class SystemItem implements ISystemItem {
    id: string;
    name: string;
    codename: string;
    type: string;
    last_modified: Date;
    constructor(id: string, name: string, codename: string, type: string, last_modified: Date);
}
