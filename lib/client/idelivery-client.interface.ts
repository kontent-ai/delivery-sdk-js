import { ContentItem } from '../models';
import {
    ElementQuery,
    MultipleItemQuery,
    MultipleTypeQuery,
    SingleItemQuery,
    SingleTypeQuery,
    TaxonomiesQuery,
    TaxonomyQuery,
} from '../query';

export interface IDeliveryClient {

    /**
    * Gets query for multiple types
    */
    types(): MultipleTypeQuery;

    /**
    * Gets query for single type
    * @param {string} typeCodename - Codename of the type to retrieve
    */
    type(typeCodename: string): SingleTypeQuery;

    /**
    * Gets query for multiple items
    */
    items<TItem extends ContentItem>(): MultipleItemQuery<TItem>;

    /**
    * Gets query for single item
    * @param {string} codename - Codename of item to retrieve
    */
    item<TItem extends ContentItem>(codename: string): SingleItemQuery<TItem>;

    /**
    * Gets query for multiple taxonomies
    */
    taxonomies(): TaxonomiesQuery;

    /**
    * Gets query for single item
    * @param {string} codename - Codename of taxonomy to retrieve
    */
    taxonomy(codename: string): TaxonomyQuery;

    /**
     * Gets query for an element within a type
     */
    element(typeCodename: string, elementCodename: string): ElementQuery;
}
