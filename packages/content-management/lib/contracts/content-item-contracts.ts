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

    export interface IContentItemsListingResponseContract {
        items: IContentItemModelContract[];
        pagination: SharedContracts.IPaginationModelContract;
    }

    export interface IAddContentItemResponseContract extends IContentItemModelContract {
    }

    export interface IViewContentItemResponseContract extends IContentItemModelContract {
    }

    export interface IUpdateContentItemResponseContract extends IContentItemModelContract {
    }

    export interface IUpsertContentItemResponseContract extends IContentItemModelContract {
    }

    export interface IDeleteContentItemResponseContract {
    }

    export interface IUpdateContentItemPostContract {
        name: string;
        sitemap_locations: [{
            codename: string
        }] | [];
    }

    export interface IUpsertContentItemPostContract {
        name: string;
        type: string;
        sitemap_locations?: [{
            codename: string
        }];
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

