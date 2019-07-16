import { ContentTypeSystemAttributes } from './content-type-system-attributes.class';
import { GenericElement } from '../element/generic-element.class';

export class ContentType {

    /**
    * Content type system attributes
    */
    public system!: ContentTypeSystemAttributes;

    /**
    * Elements (elements) assigned to content type
    */
    public elements!: GenericElement[];

    constructor(
        data: {
            system: ContentTypeSystemAttributes,
            elements: GenericElement[]
        }
    ) {
        Object.assign(this, data);
    }
}
