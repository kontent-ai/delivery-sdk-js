import { IKontentResponse, IKontentResponseDebug } from './common-models';
import { IBaseResponse } from '@kentico/kontent-core';

export class BaseKontentResponse implements IKontentResponse {

    public readonly staleContentHeaderName: string = 'X-Stale-Content';
    public readonly debug: IKontentResponseDebug;
    public readonly hasStaleContent: boolean;

    constructor(response: IBaseResponse<any>) {
        this.debug = this.getResponseDebug(response);
        this.hasStaleContent = this.getHasStaleContent(response);
    }

    private getHasStaleContent(response: IBaseResponse<any>): boolean {
        const hasStaleContentHeader = response.headers.find(m => m.header.toLowerCase() === this.staleContentHeaderName.toLowerCase());

        if (hasStaleContentHeader) {
            if (hasStaleContentHeader.value.toString() === '1') {
                return true;
            }
        }
        return false;
    }

    private getResponseDebug(response: IBaseResponse<any>): IKontentResponseDebug {
        return {
            response: response.response,
            headers: response.headers,
            status: response.status
        };
    }
}
