import { ElementModels } from '../elements/elements.models';
import { SharedModels } from '../shared/shared-models';

export namespace LanguageVariantModels {

    export interface ILangaugeVariantReference {
        id?: string;
        codename?: string;
        external_id?: string;
    }

    export interface ILanguageVariantElementInfo {
        codename: string;
    }

    export interface ILanguageVariantElement {
        element: ILanguageVariantElementInfo;
        value: string | number | undefined | ILangaugeVariantReference[];
    }

    export interface ILanguageVariantElementCodename {
        codename: string;
        value: string | number | undefined | ILangaugeVariantReference[];
    }

    export class ContentItemLanguageVariant {
        public item!: SharedModels.ReferenceObject;
        public elements!: ElementModels.ContentItemElement[];
        public language!: SharedModels.ReferenceObject;
        public lastModified!: Date;
        public workflowStep!: SharedModels.ReferenceObject;

        constructor(
            data: {
                rawElements: any,
                item: SharedModels.ReferenceObject,
                elements: ElementModels.ContentItemElement[],
                language: SharedModels.ReferenceObject,
                lastModified: Date,
                workflowStep: SharedModels.ReferenceObject
            }
        ) {
            Object.assign(this, data);
        }
    }
}
