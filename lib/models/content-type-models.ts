import { IQueryConfig } from './common/common-models';
import { IGenericElement } from './element-models';

export interface IContentTypeSystemAttributes<TContentTypeCodename extends string> {
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
    codename: TContentTypeCodename;

    /**
     * Date of last modification
     */
    lastModified: Date;
}

export interface IContentType<TContentTypeCodename extends string> {
    /**
     * Content type system attributes
     */
    system: IContentTypeSystemAttributes<TContentTypeCodename>;

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
