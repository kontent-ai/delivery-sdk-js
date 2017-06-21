export class CloudError{

    constructor(
        public message: string,
        public request_id: number,
        public error_code: number,
        public specific_code: number,
        public rawError: any
    ) {
    }
}