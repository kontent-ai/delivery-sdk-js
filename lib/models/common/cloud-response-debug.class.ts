import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';
import { AjaxResponse } from 'rxjs/Rx';

export class CloudResponseDebug extends AjaxResponse implements ICloudResponseDebug {

    constructor(ajaxResponse: AjaxResponse){
        super(ajaxResponse.originalEvent, ajaxResponse.xhr, ajaxResponse.request)
    } 
}