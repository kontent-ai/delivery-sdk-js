import { IAsset, IMultipleChoiceOption } from './field-interfaces';

export class AssetModel implements IAsset {
    constructor(
        public name: string,
        public type: string,
        public size: number,
        public description: string,
        public url: string,
    ) { }
}

export class MultipleChoiceOption implements IMultipleChoiceOption {
    constructor(
        public name: string,
        public codename: string
    ) { }
}