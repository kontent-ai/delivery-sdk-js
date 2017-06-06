import { IPagination } from '../../interfaces/common/ipagination.interface';

export class Pagination implements IPagination {

    /**
    * Pagination object
    * @constructor
    * @param {string} skip - Number of content items skipped from the response
    * @param {FieldType} limit - Number of content items returned in the response
    * @param {TypeResolver[]} count - Number of retrieved content items
    * @param {boolean} next_page - URL to the next page of results
    */
    constructor(
        public skip: number,
        public limit: number,
        public count: number,
        public next_page: string
    ) { }
}