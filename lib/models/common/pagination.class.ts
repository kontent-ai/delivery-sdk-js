export class Pagination {

    public skip: number;
    public limit: number;
    public count: number;
    public next_page: string;

    constructor(
        data: {
            skip: number;
            limit: number;
            count: number;
            next_page: string;
        }
    ) {
        Object.assign(this, data);
    }
}
