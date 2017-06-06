import { IItemQueryConfig } from '../../interfaces/item/iitem-query.config';
import { IContentItem } from '../../interfaces/item/icontent-item.interface';

export class ItemQueryConfig implements IItemQueryConfig {

    /**
    * Callback used to resolve URL slug. This has priority over url slug resolved defined on model level
    */
    public urlSlugResolver?: (contentItem: IContentItem, value: string) => string;

    /**
    * Configuration of query
    * @constructor
    * @param {(contentItem: IContentItem, value: string) => string} urlSlugResolver - Callback used to resolve URL slug. This has priority over url slug resolved defined on model level
    */
    constructor(
        config?: {
            urlSlugResolver?: (contentItem: IContentItem, value: string) => string
        }) {
        if (config) Object.assign(this, config);
    }
}