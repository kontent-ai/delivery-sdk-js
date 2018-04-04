import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';

export class CloudResponseDebug implements ICloudResponseDebug {
    constructor(
        public rawResponse: any) {
    }
}
