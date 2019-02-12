import { IPaginationContract } from './shared/ipagination.interface';

export namespace ItemContracts {

  export interface ILinkContract {
    codename: string;
    type: string;
    url_slug: string;
  }

  export interface IModularContentContract {
    system: IContentItemSystemAttributesContract;
    elements: any;
  }

  export interface IContentItemContract {
    system: IContentItemSystemAttributesContract;
    elements: any;
  }

  export interface IContentItemSystemAttributesContract {
    id: string;
    name: string;
    codename: string;
    type: string;
    last_modified: Date;
    language: string;
    sitemap_locations: string[];
  }

  export interface IItemsResponseContract {
    items: IContentItemContract[];
    modular_content: IModularContentContract[];
    pagination: IPaginationContract;
  }

  export interface IItemResponseContract {
    item: IContentItemContract;
    modular_content: IModularContentContract[];
  }
}

