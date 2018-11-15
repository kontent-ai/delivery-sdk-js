import { SharedContracts } from './shared-contracts';

export namespace ContentItemContracts {
    export interface IContentItemModelContract {
        id: string;
        name: string;
        codename: string;
        type: {
            id: string
        };
        sitemap_locations: [{
            id: string
        }];
        external_id?: string;
        last_modified: Date;
    }

    export interface ILanguageVariantModelContract {
        item: SharedContracts.IReferenceObjectContract;
        elements: any;
        language: SharedContracts.IReferenceObjectContract;
        last_modified: string;
    }

    export interface IContentItemsListingResponseContract {
        items: IContentItemModelContract[];
        pagination: SharedContracts.IPaginationModelContract;
    }

    // tslint:disable-next-line:no-empty-interface
    export interface IListLanguageVariantsResponseContract extends ILanguageVariantModelContract {
    }

    // tslint:disable-next-line:no-empty-interface
    export interface IAddContentItemResponseContract extends IContentItemModelContract {
    }

    // tslint:disable-next-line:no-empty-interface
    export interface IViewContentItemResponseContract extends IContentItemModelContract {
    }

    // tslint:disable-next-line:no-empty-interface
    export interface IUpdateContentItemResponseContract extends IContentItemModelContract {
    }

    // tslint:disable-next-line:no-empty-interface
    export interface IDeleteContentItemResponseContract {
    }

    export interface IUpdateContentItemPostContract {
        name: string;
        sitemap_locations: [{
            codename: string
        }] | [];
    }

    export interface IAddContentItemPostContract {
        name: string;
        type: {
            codename: string
        };
        sitemap_locations?: [{
            codename: string
        }];
        external_id?: string;
    }
}

