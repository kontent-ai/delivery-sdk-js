import { ElementModels } from '../elements/elements.models';
import { SharedModels } from '../shared/shared-models';

export namespace LanguageVariantModels {

    export class ContentItemLanguageVariant {
        public item!: SharedModels.ReferenceObject;
        public elements!: ElementModels.ContentItemElement[];
        public language!: SharedModels.ReferenceObject;
        public lastModified!: Date;

        constructor(
            data: {
                rawElements: any;
                item: SharedModels.ReferenceObject;
                elements: ElementModels.ContentItemElement[];
                language: SharedModels.ReferenceObject;
                lastModified: Date;
            }
        ) {
            Object.assign(this, data);
        }
    }
}
