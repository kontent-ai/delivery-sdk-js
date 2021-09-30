import { IContentItem, IContentItemsContainer } from '../models/item-models';

export class LinkedItemsHelper {

    convertLinkedItemsToArray(linkedItems: IContentItemsContainer): IContentItem[] {
        const linkedItemsArray: IContentItem[] = [];

        for (const linkedItemKey of Object.keys(linkedItems)) {
            linkedItemsArray.push(linkedItems[linkedItemKey]);
        }

        return linkedItemsArray;
    }
}

export const linkedItemsHelper = new LinkedItemsHelper();
