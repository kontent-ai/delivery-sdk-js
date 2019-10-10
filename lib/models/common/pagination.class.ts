export class Pagination {

    public skip!: number;
    public limit!: number;
    public count!: number;
    public nextPage!: string;

    constructor(
        data: {
            skip: number;
            limit: number;
            count: number;
            nextPage: string;
        }
    ) {
        Object.assign(this, data);
    }
}
