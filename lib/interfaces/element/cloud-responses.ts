import { IElementOption } from './ielement-option.interface';

export namespace CloudElementResponseInterfaces {

    export interface ICloudElementResponse {
        type: string;
        name: string;
        codename: string;
        taxonomy_group?: string;
        options?: IElementOption[];
    }
}
