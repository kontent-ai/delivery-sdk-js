import { IItemQueryConfig } from '../../interfaces/item/iitem-query.config';
import { IContentItem } from '../../interfaces/item/icontent-item.interface';

export class ItemQueryConfig implements IItemQueryConfig {

    /**
    * Callback used to resolve URL slug. This has priority over url slug resolved defined on model level
    */
    public urlSlugResolver?: (contentItem: IContentItem, value: string) => string;

    /**
    * Indicates if query should use preview mode. Overrides global settings of Delivery Client
    */
    public usePreviewMode?: boolean;

    /**
    * Configuration of query
    * @constructor
    * @param {(contentItem: IContentItem, value: string) => string} urlSlugResolver - Callback used to resolve URL slug. This has priority over url slug resolved defined on model level
    * @param {boolean} usePreviewMode - Indicates if query should use preview mode. Overrides global settings of Delivery Client
    */
    constructor(
        config?: {
            urlSlugResolver?: (contentItem: IContentItem, value: string) => string,
            usePreviewMode?: boolean
        }) {
        if (config) Object.assign(this, config);
    }
}