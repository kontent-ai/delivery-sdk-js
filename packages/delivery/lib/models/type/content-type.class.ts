import { ContentTypeSystemAttributes } from './content-type-system-attributes.class';
import { Element } from '../element/element.class';

export class ContentType {

    /**
    * Content type system attributes
    */
    public system!: ContentTypeSystemAttributes;

    /**
    * Elements (fields) assigned to content type
    */
    public elements!: Element[];

    constructor(
        data: {
            system: ContentTypeSystemAttributes,
            elements: Element[]
        }
    ) {
        Object.assign(this, data);
    }
}
