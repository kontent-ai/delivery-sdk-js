import { IContentItem, ILinkResolverContext, ILinkResolverResult, IRichTextResolverContext } from '../../interfaces';
import { ContentItemSystemAttributes } from './content-item-system-attributes';
import { Link } from './link.class';

export class ContentItem implements IContentItem {

    /**
     * Indexer
     */
    [key: string]: any;

    /**
     * Content item system elements
     */
    public system!: ContentItemSystemAttributes;

    /**
     * Elements of the item
     */
    public elements: any;

    /**
    * Function used to bind fields returned from Kentico Cloud to a model property.
    * Common use is to bind e.g. 'FirstName' field from Kentico Cloud response to 'firstName' field in model
     */
    public propertyResolver?: (fieldName: string) => string;

    /**
     * Function used to resolve links or URL slug fields
     */
    public linkResolver?: (link: Link, context: ILinkResolverContext) => string | ILinkResolverResult;

    /**
    * Function used to resolve linked items in rich text fields to HTML
    */
    public richTextResolver?: (contentItem: ContentItem, context: IRichTextResolverContext) => string;

    /**
    * Base class representing content item type. All content type models need to extend this class.
    * @constructor
    */
    constructor(data?: {
        /**
         * Function used to bind fields returned from Kentico Cloud to a model property.
         * Common use is to bind e.g. 'FirstName' field from Kentico Cloud response to 'firstName' field in model
         */
        propertyResolver?: (fieldName: string) => string | undefined,

        /**
         *  Function used to resolve links or URL slug fields
         */
        linkResolver?: (link: Link, context: ILinkResolverContext) => string | ILinkResolverResult,

        /**
         * Function used to resolve linked items in rich text fields to HTML
         */
        richTextResolver?: (contentItem: ContentItem, context: IRichTextResolverContext) => string,
    }) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
