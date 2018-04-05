export interface IPaginationContract {
    skip: number;
    limit: number;
    count: number;
    next_page: string;
}
