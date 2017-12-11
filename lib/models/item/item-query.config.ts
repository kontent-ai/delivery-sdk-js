import { IItemQueryConfig } from '../../interfaces/item/iitem-query.config';
import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { ILink } from '../../interfaces/item/ilink.interface';
import { QueryConfig } from '../common/query.config';

export class ItemQueryConfig extends QueryConfig implements IItemQueryConfig {

    /**
    * Callback used to resolve link url
    */
    public linkResolver?: (link: ILink) => string;

    /**
     * Callback used to resolve modular content nested in Rich text fields to proper HTML
     */
    public richTextResolver?: (contentItem: IContentItem) => string;

    /**
    * Configuration of query
    * @constructor
    * @param {boolean} waitForLoadingNewContent - Indicates if new content should be loaded
    * @param {boolean} usePreviewMode - Indicates if query should use preview mode. Overrides global settings of Delivery Client
    * @param {(link: ILink) => string} linkResolver - Callback used to resolve URL slug. This has priority over url slug resolved defined on model level
    * @param {<T extends IContentItem>(contentItem: T) => string} richTextResolver?: Callback used to resolve modular content nested in Rich text fields to proper HTML
    */
    constructor(
        options?: {
            usePreviewMode?: boolean,
            waitForLoadingNewContent?: boolean,
            linkResolver?: (link: ILink) => string,
            richTextResolver?: (contentItem: IContentItem) => string;
        }) {
        super(options);
        if (options) { Object.assign(this, options); }
    }
}
