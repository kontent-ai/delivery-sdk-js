export interface IAsset {
    name: string;
    type: string;
    size: number;
    description: string;
    url: string;
}

export interface IMultipleChoiceOption {
    name: string;
    codename: string;
}

export interface ITaxonomyTerm{
    name: string;
    codename: string;
}