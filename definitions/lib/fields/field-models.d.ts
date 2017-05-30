import { IAsset, IMultipleChoiceOption } from './field-interfaces';
export declare class AssetModel implements IAsset {
    name: string;
    type: string;
    size: number;
    description: string;
    url: string;
    constructor(name: string, type: string, size: number, description: string, url: string);
}
export declare class MultipleChoiceOption implements IMultipleChoiceOption {
    name: string;
    codename: string;
    constructor(name: string, codename: string);
}
