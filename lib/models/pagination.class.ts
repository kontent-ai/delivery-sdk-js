import { IPagination } from '../interfaces/ipagination.interface';

export class Pagination implements IPagination {

    constructor(
        public skip: number,
        public limit: number,
        public count: number,
        public next_page: string
    ) { }
}