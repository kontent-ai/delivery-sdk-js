export interface IContentItemSystemAttributes {
    /**
   * Id of the item
   */
    id: string;

    /**
     * Name of the item
     */
    name: string;

    /**
     * Codename of the item
     */
    codename: string;

    /**
     * Codename of the type this item is using
     */
    type: string;

    /**
     * Date when the item was last modified
     */
    lastModified: Date;

    /**
     * Codename of the language
     */
    language: string;

    /**
     * Array of sitemap locatoins
     */
    sitemapLocations: string[];
}
