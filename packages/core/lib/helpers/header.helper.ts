import { ISDKInfo } from '../models';

import { IHeader } from '../http/http.models';

export class HeaderHelper {

    /**
    * Header name for SDK usage
    */
    private readonly sdkVersionHeader: string = 'X-KC-SDKID';

    /**
    * Header identifying SDK type & version for internal purposes of Kentico
    */
    getSdkIdHeader(info: ISDKInfo): IHeader {
        return {
            header: this.sdkVersionHeader,
            value: `${info.host};${info.name};${info.version}`
        };
    }
}

export const headerHelper = new HeaderHelper();
