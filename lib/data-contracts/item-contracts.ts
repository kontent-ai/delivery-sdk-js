import { IPaginationContract } from './shared/ipagination.interface';
import { ElementContracts } from './element-contracts';

export namespace ItemContracts {

  export interface IContentItemElementsContracts {
     [key: string]: ElementContracts.IElementContract;
  }

  export interface ILinkContract {
    codename: string;
    type: string;
    url_slug: string;
  }

  export interface IModularContentContract {
    [key: string]: ItemContracts.IModularContentContentItemContract;
  }


  export interface IModularContentContentItemContract {
    system: IContentItemSystemAttributesContract;
    elements: IContentItemElementsContracts;
  }

  export interface IContentItemContract {
    system: IContentItemSystemAttributesContract;
    elements: IContentItemElementsContracts;
  }

  export interface IContentItemSystemAttributesContract {
    id: string;
    name: string;
    codename: string;
    type: string;
    last_modified: string;
    language: string;
    sitemap_locations: string[];
    collection: string;
  }

  export interface IItemsWithModularContentContract {
    items: IContentItemContract[];
    modular_content: ItemContracts.IModularContentContract;
  }

  export interface IItemsFeedContract extends IItemsWithModularContentContract {
    }

  export interface IListContentItemsContract extends IItemsWithModularContentContract {
    pagination: IPaginationContract;
  }

  export interface IViewContentItemContract {
    item: IContentItemContract;
    modular_content: ItemContracts.IModularContentContract;
  }
}

