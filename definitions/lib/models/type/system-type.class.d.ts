import { ISystemType } from '../../interfaces/type/isystem-type.interface';
export declare class TypeSystem implements ISystemType {
    id: string;
    name: string;
    codename: string;
    last_modified: Date;
    constructor(id: string, name: string, codename: string, last_modified: Date);
}
