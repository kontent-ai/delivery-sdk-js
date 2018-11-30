import { IContentItemSystemAttributes } from './icontent-item-system-attributes.interface';

export interface IContentItem {

    /**
 * Indexer
 */
    [key: string]: any;

    /**
     * Content item system elements
     */
    system: IContentItemSystemAttributes;

    /**
     * Elements of the item
     */
    elements: any;
}
