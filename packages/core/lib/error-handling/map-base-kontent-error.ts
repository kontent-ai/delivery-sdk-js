import { BaseKontentError } from './base-kontent-error';

const KCErrorNames = {
    errorCode: 'error_code',
    message: 'message',
    requestId: 'request_id',
    specificCode: 'specific_code'
};

export function mapBaseKontentError(error: any): BaseKontentError | any {
    if (error.response && error.response.data && error.response.data[KCErrorNames.requestId]) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const data = error.response.data;
        return new BaseKontentError({
            requestId: data[KCErrorNames.requestId],
            message: data[KCErrorNames.message] ? data[KCErrorNames.message] : '',
            errorCode: data[KCErrorNames.errorCode] ? data[KCErrorNames.errorCode] : 0,
            specificCode: data[KCErrorNames.specificCode] ? data[KCErrorNames.specificCode] : 0,
            originalError: error
        });
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        return error;
    }

    // Something happened in setting up the request that triggered an Error
    return error;
}
