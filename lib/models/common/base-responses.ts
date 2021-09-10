import { IResponse } from '@kentico/kontent-core';
import { IKontentResponse } from './common-models';
import { staleContentHeaderName } from './headers';

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

export abstract class BaseKontentResponse implements IKontentResponse {
    public hasStaleContent: boolean;

    constructor(response: IResponse<any>) {
        this.hasStaleContent = getHasStaleContent(response);
    }
}

export abstract class BaseGroupedKontentResponse implements IKontentResponse {
    constructor(public responses: IKontentResponse[]) {}
}
