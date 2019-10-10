export interface IElementContract {
    [key: string]: any;

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

