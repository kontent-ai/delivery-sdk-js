export interface IElementContract {
    codename: string;
    type: string;
    name: string;
    taxonomyGroup?: string;
    options?: IElementOptionContract[];
}

export interface IElementOptionContract {
    name: string;
    codename: string;
}

