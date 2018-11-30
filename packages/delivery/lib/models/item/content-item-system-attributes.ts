import { IContentItemSystemAttributes } from '../../interfaces';

export class ContentItemSystemAttributes implements IContentItemSystemAttributes {

    /**
    * Id of the item
    */
    public id!: string;

    /**
     * Name of the item
     */
    public name!: string;

    /**
     * Codename of the item
     */
    public codename!: string;

    /**
     * Codename of the type this item is using
     */
    public type!: string;

    /**
     * Date when the item was last modified
     */
    public lastModified!: Date;

    /**
     * Codename of the language
     */
    public language!: string;

    /**
     * Array of sitemap locatoins
     */
    public sitemapLocations!: string[];

    constructor(
        data: {
            id: string,
            name: string,
            codename: string,
            type: string,
            lastModified: Date,
            language: string,
            sitemapLocations: string[]
        }
    ) {
        Object.assign(this, data);
    }
}

