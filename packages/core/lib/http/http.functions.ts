import axios, { AxiosResponse } from 'axios';

import { httpDebugger } from './http.debugger';
import { IHeader, IHttpGetQueryCall, IHttpPostQueryCall, IHttpQueryOptions, IHttpRequestResult } from './http.models';

export function getCallback<TError>(call: IHttpGetQueryCall<TError>, options: IHttpQueryOptions | undefined, callback: (response: IHttpRequestResult<AxiosResponse>) => void): void {
    httpDebugger.debugStartHttpRequest();

    const axiosPromise = axios.get(call.url, {
        headers: getHeadersJson(
            options && options.headers ? options.headers : []
        )
    });

    axiosPromise.then(response => {
        httpDebugger.debugResolveHttpRequest();
        callback({
            response: response
        });
    }, error => {
        httpDebugger.debugFailedHttpRequest();
        callback({
            error: error
        });
    });
}

export function postCallback<TError>(call: IHttpPostQueryCall<TError>, options: IHttpQueryOptions | undefined, callback: (response: IHttpRequestResult<AxiosResponse>) => void): void {
    httpDebugger.debugStartHttpRequest();

    const axiosPromise = axios.post(call.url, call.body, {
        headers: getHeadersJson(
            options && options.headers ? options.headers : []
        )
    });

    axiosPromise.then(response => {
        httpDebugger.debugResolveHttpRequest();
        callback({
            response: response
        });
    }, error => {
        httpDebugger.debugFailedHttpRequest();
        callback({
            error: error
        });
    });
}

export function getHeadersJson(headers: IHeader[]): any {
    const headerJson: any = {
        'Content-Type': 'application/json'
    };

    if (!headers) {
        return headerJson;
    }

    headers.forEach(header => {
        headerJson[header.header] = header.value;
    });

    return headerJson;
}
