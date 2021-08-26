import { IQueryConfig } from '../common/common-models';
import { GenericElement } from '../element/element-models';
export declare class ContentTypeSystemAttributes {
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
    constructor(data: {
        id: string;
        name: string;
        codename: string;
        lastModified: Date;
    });
}
export declare class ContentType {
    /**
    * Content type system attributes
    */
    system: ContentTypeSystemAttributes;
    /**
    * Elements (elements) assigned to content type
    */
    elements: GenericElement[];
    constructor(data: {
        system: ContentTypeSystemAttributes;
        elements: GenericElement[];
    });
}
export interface IContentTypeQueryConfig extends IQueryConfig {
}
