import { ElementModels } from '../elements/elements.models';

export namespace ContentTypeModels {

    export class ContentType {

        public id!: string;
        public name!: string;
        public codename!: string;
        public lastModified!: Date;
        public elements!: ElementModels.ElementModel[] | ElementModels.MultipleChoiceElementModel[];

        constructor(
            data: {
                id: string;
                name: string,
                codename: string,
                lastModified: Date,
                elements: ElementModels.ElementModel[] | ElementModels.MultipleChoiceElementModel[]
            }
        ) {
            Object.assign(this, data);
        }
    }

    export interface IAddContentTypeData {
        name: string;
        external_id?: string;
        elements: IAddContentTypeElementData[];
    }

    export interface IAddContentTypeElementData {
        name?: string;
        type: ElementModels.ElementType;
        guidelines?: string;
        options?: IAddContentTypeElementMultipleChoiceElementOptionsData[];
        mode?: ElementModels.ElementMode;
    }

    export interface IAddContentTypeElementMultipleChoiceElementOptionsData {
        name: string;
    }
}
