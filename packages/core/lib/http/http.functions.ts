import axios, { AxiosResponse } from 'axios';

import { httpDebugger } from './http.debugger';
import {
    IHeader,
    IHttpDeleteQueryCall,
    IHttpGetQueryCall,
    IHttpPostQueryCall,
    IHttpPutQueryCall,
    IHttpQueryOptions,
    IHttpRequestResult,
} from './http.models';

export function getCallback<TError>(call: IHttpGetQueryCall<TError>, options: IHttpQueryOptions | undefined, callback: (response: IHttpRequestResult<AxiosResponse>) => void): void {
    httpDebugger.debugStartHttpRequest();

    const axiosPromise = axios.get(call.url, {
        headers: getHeadersJson(
            options && options.headers ? options.headers : [],
        ),
        responseType: options && options.responseType ? options.responseType : undefined
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

export function putCallback<TError>(call: IHttpPutQueryCall<TError>, options: IHttpQueryOptions | undefined, callback: (response: IHttpRequestResult<AxiosResponse>) => void): void {
    httpDebugger.debugStartHttpRequest();

    const axiosPromise = axios.put(call.url, call.body, {
        headers: getHeadersJson(
            options && options.headers ? options.headers : []
        ),
        responseType: options && options.responseType ? options.responseType : undefined
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

export function deleteCallback<TError>(call: IHttpDeleteQueryCall<TError>, options: IHttpQueryOptions | undefined, callback: (response: IHttpRequestResult<AxiosResponse>) => void): void {
    httpDebugger.debugStartHttpRequest();

    const axiosPromise = axios.delete(call.url, {
        headers: getHeadersJson(
            options && options.headers ? options.headers : []
        ),
        responseType: options && options.responseType ? options.responseType : undefined
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
        ),
        responseType: options && options.responseType ? options.responseType : undefined
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

export function getHeadersJson(headers: IHeader[]): { [header: string]: string } {
    const headerJson: { [header: string]: string } = {};

    headers.forEach(header => {
        headerJson[header.header] = header.value;
    });

    // add default content type header if not present
    const contentTypeHeader = headers.find(m => m.header.toLowerCase() === 'Content-Type'.toLowerCase());

    if (!contentTypeHeader) {
        headerJson['Content-Type'] = 'application/json';
    }

    return headerJson;
}
