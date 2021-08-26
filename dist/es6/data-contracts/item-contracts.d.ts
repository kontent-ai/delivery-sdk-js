import { IPaginationContract } from './shared/ipagination.interface';
import { ElementContracts } from './element-contracts';
export declare namespace ItemContracts {
    interface IContentItemElementsContracts {
        [key: string]: ElementContracts.IElementContract;
    }
    interface ILinkContract {
        codename: string;
        type: string;
        url_slug: string;
    }
    interface IModularContentContract {
        [key: string]: ItemContracts.IModularContentContentItemContract;
    }
    interface IModularContentContentItemContract {
        system: IContentItemSystemAttributesContract;
        elements: IContentItemElementsContracts;
    }
    interface IContentItemContract {
        system: IContentItemSystemAttributesContract;
        elements: IContentItemElementsContracts;
    }
    interface IContentItemSystemAttributesContract {
        id: string;
        name: string;
        codename: string;
        type: string;
        last_modified: string;
        language: string;
        sitemap_locations: string[];
        collection: string;
    }
    interface IItemsWithModularContentContract {
        items: IContentItemContract[];
        modular_content: ItemContracts.IModularContentContract;
    }
    interface IItemsFeedContract extends IItemsWithModularContentContract {
    }
    interface IListContentItemsContract extends IItemsWithModularContentContract {
        pagination: IPaginationContract;
    }
    interface IViewContentItemContract {
        item: IContentItemContract;
        modular_content: ItemContracts.IModularContentContract;
    }
}
