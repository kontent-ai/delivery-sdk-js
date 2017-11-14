import { IContentType } from './icontent-type.interface';
import { IContentTypeSystemAttributes } from './icontent-type-system-attributes.interface';
import { IPagination } from '../common/ipagination.interface';
import { IElement } from '../element/ielement.interface';
import { IElementOption } from '../element/ielement-option.interface';

export namespace CloudTypeResponseInterfaces {

    export interface ICloudMultipleTypeResponse {
        types: IContentType[];
        pagination: IPagination;
    }

    export interface ICloudSingleTypeResponse {
        system: IContentTypeSystemAttributes;
        elements: IContentTypeElementCloudResponse[];
    }

    export interface IContentTypeElementCloudResponse {
        codename: string;
        type: string;
        name: string;
        taxonomy_group?: string;
        options?: IElementOption[];
    }
}
