// rxjs observable
import { Observable } from 'rxjs/Rx';

// nodejs https service
import * as https from 'https';
import { RequestOptions } from 'https';
import { OutgoingHttpHeaders, IncomingMessage } from 'http';

// interfaces
import { IHttpService } from './ihttp.service';

// nodejs url
// this URL is used instead of the DOM URL which is not available in node.js environment
import { URL } from 'url';

// models
import { BaseResponse } from './base-response.class';
import { IHeader } from '../../interfaces/common/iheader.interface';

class ResponseCallback {
    constructor(
        public response: string | null = null,
        public incomingMessage: IncomingMessage | null = null,
        public error: Error | null = null
    ) {
    }
}

export class HttpNodeJsService implements IHttpService {

    get(url: string, headers: IHeader[]): Observable<BaseResponse> {
        return this.getDataObservable(url, headers)
            .map((responseCallback: ResponseCallback) => {
                if (responseCallback.error) {
                    throw Error(`${responseCallback.error.message}, stack: ${responseCallback.error.stack}`);
                }

                if (!responseCallback.incomingMessage || !responseCallback.response) {
                    throw Error(`Invalid response. Incoming message or response is not set.`);
                }

                let json;
                try {
                    json = JSON.parse(responseCallback.response);
                } catch (err) {
                    throw Error(`Parsing response from node http response to JSON failed`);
                }

                return new BaseResponse(
                    json,
                    responseCallback.incomingMessage
                );
            })
            .catch(err => {
                return Observable.throw(`Http service for node.js failed to get/resolve Observable with error: ${err.message ? err.message : err}`);
            });
    }

    /**
    * Request sample code taken from nodejs.org doc.
    * https://nodejs.org/api/http.html#http_http_get_options_callback
    * @param {string} url
    * @param {IHeader[]} headers
    * @param {any} callback
    */
    private getData(url: string, headers: IHeader[], callback) {

        const doCallback = (response: string | null = null, incomingMessage: IncomingMessage | null = null, error: Error | null = null) => {
            // Note: Callback needs & expects to have first param set (e.g. to null), otherwise it will fail
            callback(null, new ResponseCallback(response, incomingMessage, error));
        };

        const typedUrl: URL = new URL(url);
        const outgoingHeaders = {} as OutgoingHttpHeaders;

        if (headers) {
            headers.forEach(header => {
                outgoingHeaders[header.header] = header.value;
            })
        }

        https.get(({
            method: 'GET',
            protocol: typedUrl.protocol,
            hostname: typedUrl.hostname,
            path: typedUrl.pathname + typedUrl.search,
            headers: outgoingHeaders,
        }), (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'] as string;
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed. Verify that your URL contains valid Kentico Cloud parameters. \n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
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

    getDataObservable(url: string, headers: IHeader[]): Observable<any> {
        return Observable.bindNodeCallback(this.getData)(url, headers);
    }
}



