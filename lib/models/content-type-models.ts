import { IQueryConfig } from './common/common-models';
import { IGenericElement } from './element-models';

export interface IContentTypeSystemAttributes {
    /**
     * Id of the type
     */
    id: string;

    /**
     * Name of the type
     */
    name: string;

    /**
     * Codename of the type
     */
    codename: string;

    /**
     * Date of last modification
     */
    lastModified: Date;
}

export interface IContentType {
    /**
     * Content type system attributes
     */
    system: IContentTypeSystemAttributes;

    /**
     * Elements (elements) assigned to content type
     */
    elements: IGenericElement[];
}

export interface IContentTypeQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}
