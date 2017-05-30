import { ISystemType } from '../../interfaces/type/isystem-type.interface';

export class TypeSystem implements ISystemType {

    constructor(
        public id: string,
        public name: string,
        public codename: string,
        public last_modified: Date
    ) { }
}

