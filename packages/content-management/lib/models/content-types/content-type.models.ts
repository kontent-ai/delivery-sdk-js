import { ElementModels } from '../elements/elements.models';

export namespace ContentTypeModels {

    export class ContentType {

        public id!: string;
        public name!: string;
        public codename!: string;
        public lastModified!: Date;
        public elements!: ElementModels.ElementModel[];

        constructor(
            data: {
                id: string;
                name: string,
                codename: string,
                lastModified: Date,
                elements: ElementModels.ElementModel[]
            }
        ) {
            Object.assign(this, data);
        }
    }
}
