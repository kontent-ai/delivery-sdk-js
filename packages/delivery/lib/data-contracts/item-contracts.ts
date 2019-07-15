import { IPaginationContract } from './shared/ipagination.interface';
import { FieldContracts } from './field-contracts';

export namespace ItemContracts {

  export interface IContentItemElementsContracts {
     [key: string]: FieldContracts.IFieldContract;
  }

  export interface ILinkContract {
    codename: string;
    type: string;
    url_slug: string;
  }

  export interface IModularContentWrapperContract {
    [key: string]: ItemContracts.IModularContentContract;
  }


  export interface IModularContentContract {

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
  }

  export interface IItemsResponseContract {
    items: IContentItemContract[];
    modular_content: ItemContracts.IModularContentWrapperContract;
    pagination: IPaginationContract;
  }

  export interface IItemResponseContract {
    item: IContentItemContract;
    modular_content: ItemContracts.IModularContentWrapperContract;
  }
}

