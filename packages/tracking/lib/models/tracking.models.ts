export interface IContactRequiredData {
    uid: string;
    sid: string;
}

export interface IContactProfileData extends IContactRequiredData {
    email: string;
    name?: string;
    company?: string;
    phone?: string;
    website?: string;
}
