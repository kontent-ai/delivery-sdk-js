export class PaginationModel {
    constructor(
        public continuationToken: string | null,
        public nextPage: string | null
    ) { }
}
