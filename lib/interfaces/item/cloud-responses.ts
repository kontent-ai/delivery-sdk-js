import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IModularContent } from '../../interfaces/item/imodular-content.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';

export class ICloudResponseMultiple{
  constructor(
    public items: IContentItem[],
    public modular_content: IModularContent[],
    public pagination: IPagination
  ) { }
}

export class ICloudResponseSingle {
  constructor(
    public item: IContentItem,
    public modular_content: IModularContent[]
  ) { }
}

