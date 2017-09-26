import { IElementOption } from './ielement-option.interface';

export interface IElement {
    codename: string;
    type: string;
    name: string;
    taxonomyGroup?: string;
    options?: IElementOption[];
}