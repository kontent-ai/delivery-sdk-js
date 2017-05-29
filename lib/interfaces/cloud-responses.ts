import { IItem } from '../interfaces/iitem.interface';
import { IModularContent } from '../interfaces/imodular-content.interface';
import { IPagination } from '../interfaces/ipagination.interface';

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

