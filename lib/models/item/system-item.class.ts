import { ISystemItem } from '../../interfaces/item/isystem-item.interface';

export class SystemItem implements ISystemItem {
    constructor(
        public id: string,
        public name: string,
        public codename: string,
        public type: string,
        public last_modified: Date
    ) { }
}

