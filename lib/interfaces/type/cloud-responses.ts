import { IContentType } from './icontent-type.interface';
import { IContentTypeSystemAttributes } from './icontent-type-system-attributes.interface';
import { IContentTypeElement } from './icontent-type-element.interface';
import { IPagination } from '../common/ipagination.interface';

export namespace CloudTypeResponseInterfaces {
    export interface ICloudMultipleTypeResponse {
        types: IContentType[];
        pagination: IPagination;
    }

    export interface ICloudSingleTypeResponse {
        system: IContentTypeSystemAttributes;
        elements: IContentTypeElement[];
    }
}
