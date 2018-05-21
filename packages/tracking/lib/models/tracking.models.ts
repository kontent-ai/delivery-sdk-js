export interface IQueryParameter {
    getParam(): string;
    getParamValue(): string | undefined;
}

export interface IHeader {
    header: string;
    value: string;
}

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

export interface ISDKInfo {

    /**
     * Name of SDK
     */
    name: string;
    /**
     * Version SDK
     */
    version: string;
    /**
     * Host of SDK
     */
    host: string;
}
