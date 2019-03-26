export namespace SharedContracts {

    export interface IPaginationModelContract {
        continuation_token: string | null;
        next_page: string | null;
    }

    export interface IReferenceObjectContract {
        id?: string;
        codename?: string;
        external_id?: string;
    }

    export interface IValidationErrorContract {
        message: string;
    }
}
