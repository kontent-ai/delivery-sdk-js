import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IModularContent } from '../../interfaces/item/imodular-content.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';

export namespace CloudItemResponseInterfaces {

  export interface ICloudResponseMultiple {
    items: IContentItem[];
    modular_content: IModularContent[];
    pagination: IPagination;
  }

  export interface ICloudResponseSingle {
    item: IContentItem;
    modular_content: IModularContent[];
  }
}

