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
     * Callback used to resolve modular content nested in Rich text fields to proper HTML
     */
    public richTextResolver?: (contentItem: IContentItem) => string;

    /**
    * Configuration of query
    * @constructor
    * @param {(contentItem: IContentItem, value: string) => string} urlSlugResolver - Callback used to resolve URL slug. This has priority over url slug resolved defined on model level
    * @param {boolean} usePreviewMode - Indicates if query should use preview mode. Overrides global settings of Delivery Client
    * @param {<T extends IContentItem>(contentItem: T) => string} richTextResolver?: Callback used to resolve modular content nested in Rich text fields to proper HTML
    */
    constructor(
        config?: {
            urlSlugResolver?: (contentItem: IContentItem, value: string) => string,
            usePreviewMode?: boolean,
            richTextResolver?: (contentItem: IContentItem) => string;
        }) {
        if (config) Object.assign(this, config);
    }
}