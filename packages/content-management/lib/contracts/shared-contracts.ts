export namespace SharedContracts {

    export interface IPaginationModelContract {
        continuation_token: string | null;
        next_page: string | null;
    }
}
