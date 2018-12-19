import { ElementTypeEnum } from './element-type';

export namespace ElementModels {

    export class ElementModel {

        public name?: string;

        public id!: string;
        public codename!: string;
        public type!: ElementTypeEnum;

        constructor(
            data: {
                id: string;
                name?: string;
                codename: string;
                type: ElementTypeEnum
            }
        ) {
            Object.assign(this, data);
        }
    }
}
