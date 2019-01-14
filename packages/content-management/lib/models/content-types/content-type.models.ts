import { ElementModels } from '../elements/elements.models';

export namespace ContentTypeModels {

    export class ContentType {

        public id!: string;
        public name!: string;
        public codename!: string;
        public lastModified!: Date;
        public elements!: ElementModels.ContentTypeElementModel[];

        constructor(
            data: {
                id: string;
                name: string,
                codename: string,
                lastModified: Date,
                elements: ElementModels.ContentTypeElementModel[]
            }
        ) {
            Object.assign(this, data);
        }
    }
}
