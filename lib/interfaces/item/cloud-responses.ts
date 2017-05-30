import { IItem } from '../../interfaces/item/iitem.interface';
import { IModularContent } from '../../interfaces/item/imodular-content.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';

export class ICloudResponseMultiple{
  constructor(
    public items: IItem[],
    public modular_content: IModularContent[],
    public pagination: IPagination
  ) { }
}

export class ICloudResponseSingle {
  constructor(
    public item: IItem,
    public modular_content: IModularContent[]
  ) { }
}

