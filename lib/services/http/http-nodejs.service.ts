// rxjs observable
import { Observable } from 'rxjs/Rx';

// nodejs https service
import * as https from 'https';

// interfaces
import { IHttpService } from './ihttp.service';

// models
import { BaseResponse } from './base-response.class';
import { IHeader } from '../../interfaces/common/iheader.interface';

export class HttpNodeJsService implements IHttpService {

    get(url: string, headers: IHeader[]): Observable<BaseResponse> {
        return Observable.bindNodeCallback(this.getData)(url)
            .map((responseCallback: ResponseCallback) => {

                if (responseCallback.error) {
                    throw Error(`${responseCallback.error.message}, stack: ${responseCallback.error.stack}`);
                }

                if (!responseCallback.incomingMessage || !responseCallback.response) {
                    throw Error(`Invalid response. Incoming message or response is not set.`);
                }

                return new BaseResponse(
                    responseCallback.response,
                    responseCallback.incomingMessage
                );
            });
    }

    /**
    * Request sample code taken from nodejs.org doc.
    * https://nodejs.org/api/http.html#http_http_get_options_callback
    * @param {string} url
    * @param {any} callback
    */
    private getData(url, callback) {

        const doCallback = (response: string | null = null, incomingMessage: https.IncomingMessage | null = null, error: Error | null = null) => {
            // prepare callback data
            const data: any = {};
            data.error = error;
            data.response = response;
            data.incomingMessage = incomingMessage;

            callback(new ResponseCallback(response, incomingMessage, error));
        };

        https.get(url, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType[0])) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                doCallback(null, res, error);
                // consume response data to free up memory
                res.resume();
                return;
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                doCallback(rawData, res, error);
            });
        }).on('error', (e) => {
            doCallback(null, null, e);
        });
    }
}

class ResponseCallback {
    constructor(
        public response: string | null = null,
        public incomingMessage: https.IncomingMessage | null = null,
        public error: Error | null = null
    ) {
    }
}

