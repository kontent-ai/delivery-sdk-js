import { TrackingCloudError } from '../models';

const KCErrorNames = {
    errorId: 'error_id',
    code: 'code',
    message: 'message',
    description: 'description',
    errors: 'errors'
};

export function mapTrackingError(error: any): TrackingCloudError | any {
    if (error.response && error.response.data && error.response.data[KCErrorNames.errorId]) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const data = error.response.data;
        return new TrackingCloudError({
            errorId: data[KCErrorNames.errorId],
            message: data[KCErrorNames.message] ? data[KCErrorNames.message] : '',
            description: data[KCErrorNames.description] ? data[KCErrorNames.description] : '',
            code: data[KCErrorNames.code] ? data[KCErrorNames.code] : '',
            errors: data[KCErrorNames.errors] ? data[KCErrorNames.errors] : undefined
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
