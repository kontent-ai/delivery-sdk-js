import { IBaseResponse } from '@kentico/kontent-core';

import { IKontentResponse, IKontentResponseDebug } from './common-models';

const staleContentHeaderName: string = 'X-Stale-Content';

function getHasStaleContent(response: IBaseResponse<any>): boolean {
    const hasStaleContentHeader = response.headers.find(
        m => m.header.toLowerCase() === staleContentHeaderName.toLowerCase()
    );

    if (hasStaleContentHeader) {
        if (hasStaleContentHeader.value.toString() === '1') {
            return true;
        }
    }
    return false;
}

function getResponseDebug(response: IBaseResponse<any>): IKontentResponseDebug {
    return {
        response: response.response,
        headers: response.headers,
        status: response.status
    };
}

export abstract class BaseKontentResponse<TDebugData> implements IKontentResponse<TDebugData> {

    public readonly debug?: TDebugData;
    public abstract hasStaleContent: boolean;
    public abstract isDeveloperMode: boolean;

    constructor() {
    }
}

export class BaseKontentResponseStandardDebug extends BaseKontentResponse<IKontentResponseDebug> {

    public readonly debug?: IKontentResponseDebug;
    public readonly hasStaleContent: boolean;
    public readonly isDeveloperMode: boolean;

    constructor(response: IBaseResponse<any>, isDeveloperMode: boolean) {
        super();
        this.hasStaleContent = getHasStaleContent(response);
        this.isDeveloperMode = isDeveloperMode;

        if (isDeveloperMode) {
            this.debug = getResponseDebug(response);
        }
    }
}

export class BaseKontentResponseArrayDebug extends BaseKontentResponse<IKontentResponseDebug[]> {

    public readonly debug?: IKontentResponseDebug[] = [];
    /**
     * Always false for joined response data
     */
    public readonly hasStaleContent: boolean = false;
    public readonly isDeveloperMode: boolean;

    constructor(responses: IBaseResponse<any>[], isDeveloperMode: boolean) {
        super();
        this.isDeveloperMode = isDeveloperMode;

        if (isDeveloperMode) {
            for (const response of responses) {
                if (this.debug) {
                    this.debug.push(getResponseDebug(response));
                }
            }
        }
    }
}
