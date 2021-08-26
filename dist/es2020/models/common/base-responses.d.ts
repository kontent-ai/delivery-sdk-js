import { IBaseResponse } from '@kentico/kontent-core';
import { IKontentResponse, IKontentResponseDebug } from './common-models';
export declare abstract class BaseKontentResponse<TDebugData> implements IKontentResponse<TDebugData> {
    readonly debug?: TDebugData;
    abstract hasStaleContent: boolean;
    abstract isDeveloperMode: boolean;
    constructor();
}
export declare class BaseKontentResponseStandardDebug extends BaseKontentResponse<IKontentResponseDebug> {
    readonly debug?: IKontentResponseDebug;
    readonly hasStaleContent: boolean;
    readonly isDeveloperMode: boolean;
    constructor(response: IBaseResponse<any>, isDeveloperMode: boolean);
}
export declare class BaseKontentResponseArrayDebug extends BaseKontentResponse<IKontentResponseDebug[]> {
    readonly debug?: IKontentResponseDebug[];
    /**
     * Always false for joined response data
     */
    readonly hasStaleContent: boolean;
    readonly isDeveloperMode: boolean;
    constructor(responses: IBaseResponse<any>[], isDeveloperMode: boolean);
}
