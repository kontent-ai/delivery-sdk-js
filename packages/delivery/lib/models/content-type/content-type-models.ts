import { IQueryConfig } from '../common/common-models';
import { GenericElement } from '../element/element-models';

export class ContentTypeSystemAttributes {

    /**
    * Id of the type
    */
    public id!: string;

    /**
     * Name of the type
     */
    public name!: string;

    /**
     * Codename of the type
     */
    public codename!: string;

    /**
     * Date of last modification
     */
    public lastModified!: Date;

    constructor(
        data: {
            id: string,
            name: string,
            codename: string,
            lastModified: Date
        }
    ) {
        Object.assign(this, data);
    }
}

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

export interface IContentTypeQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}

