export interface IPagination {
    skip: number;
    limit: number;
    count: number;
    nextPage: string;
    totalCount: number | null;
}
