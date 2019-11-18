export class Pagination {

    public skip: number;
    public limit: number;
    public count: number;
    public nextPage: string;
    public totalCount?: number;

    constructor(
        data: {
            skip: number;
            limit: number;
            count: number;
            nextPage: string;
            totalCount?: number;
        }
    ) {
        this.skip = data.skip;
        this.limit = data.limit;
        this.count = data.count;
        this.nextPage = data.nextPage;
        this.totalCount = data.totalCount;
    }
}
