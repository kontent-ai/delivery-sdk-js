import { IBaseResponse } from '@kentico/kontent-core';

import { IKontentResponse, IKontentResponseDebug } from './common-models';

export class BaseKontentResponse implements IKontentResponse {
    public readonly debug?: IKontentResponseDebug;
    public readonly staleContentHeaderName: string = 'X-Stale-Content';
    public readonly hasStaleContent: boolean;
    public readonly isDeveloperMode: boolean;

    constructor(response: IBaseResponse<any>, isDeveloperMode: boolean) {
        this.hasStaleContent = this.getHasStaleContent(response);
        this.isDeveloperMode = isDeveloperMode;

        if (isDeveloperMode) {
            this.debug = this.getResponseDebug(response);
        }
    }

    private getHasStaleContent(response: IBaseResponse<any>): boolean {
        const hasStaleContentHeader = response.headers.find(
            m => m.header.toLowerCase() === this.staleContentHeaderName.toLowerCase()
        );

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
