import { IResponse } from '@kentico/kontent-core';
import { IKontentResponse, IKontentResponseDebug } from './common-models';

const staleContentHeaderName: string = 'X-Stale-Content';

function getHasStaleContent(response: IResponse<any>): boolean {
    const hasStaleContentHeader = response.headers.find(
        (m) => m.header.toLowerCase() === staleContentHeaderName.toLowerCase()
    );

    if (hasStaleContentHeader) {
        if (hasStaleContentHeader.value.toString() === '1') {
            return true;
        }
    }
    return false;
}

function getResponseDebug(response: IResponse<any>): IKontentResponseDebug {
    return {
        response: response.data,
        headers: response.headers,
        status: response.status
    };
}

export abstract class BaseKontentResponse<TDebugData> implements IKontentResponse<TDebugData> {
    public readonly debug?: TDebugData;
    public abstract hasStaleContent: boolean;

    constructor() {}
}

export class BaseKontentResponseStandardDebug extends BaseKontentResponse<IKontentResponseDebug> {
    public readonly debug?: IKontentResponseDebug;
    public readonly hasStaleContent: boolean;

    constructor(response: IResponse<any>) {
        super();
        this.hasStaleContent = getHasStaleContent(response);
        this.debug = getResponseDebug(response);
    }
}

export class BaseKontentResponseArrayDebug extends BaseKontentResponse<IKontentResponseDebug[]> {
    public readonly debug?: IKontentResponseDebug[] = [];
    /**
     * Always false for joined response data
     */
    public readonly hasStaleContent: boolean = false;

    constructor(responses: IResponse<any>[]) {
        super();

        for (const response of responses) {
            if (this.debug) {
                this.debug.push(getResponseDebug(response));
            }
        }
    }
}
