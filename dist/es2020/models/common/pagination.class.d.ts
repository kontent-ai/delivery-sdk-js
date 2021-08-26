export declare class Pagination {
    skip: number;
    limit: number;
    count: number;
    nextPage: string;
    totalCount?: number;
    constructor(data: {
        skip: number;
        limit: number;
        count: number;
        nextPage: string;
        totalCount?: number;
    });
}
