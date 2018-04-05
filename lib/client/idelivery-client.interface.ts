import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { ElementQuery } from '../query/element/element-query.class';
import { MultipleItemQuery } from '../query/item/multiple-item-query.class';
import { SingleItemQuery } from '../query/item/single-item-query.class';
import { TaxonomiesQuery } from '../query/taxonomy/taxonomies-query.class';
import { TaxonomyQuery } from '../query/taxonomy/taxonomy-query.class';
import { MultipleTypeQuery } from '../query/type/multiple-type-query.class';
import { SingleTypeQuery } from '../query/type/single-type-query.class';

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
    items<TItem extends IContentItem>(): MultipleItemQuery<TItem>;

    /**
    * Gets query for single item
    * @param {string} codename - Codename of item to retrieve
    */
    item<TItem extends IContentItem>(codename: string): SingleItemQuery<TItem>;

    /**
    * Gets query for multiple taxonomies
    */
    taxonomies(): TaxonomiesQuery;

    /**
    * Gets query for single item
    * @param {string} codename - Codename of taxonomy to retrieve
    */
    taxonomy<TItem extends IContentItem>(codename: string): TaxonomyQuery;

    /**
     * Gets query for an element within a type
     */
    element(typeCodename: string, elementCodename: string): ElementQuery;
}
