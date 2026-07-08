import { DeliveryClient, IDeliveryClientConfig } from '../../../lib';
import { Context } from './context';

const defaultenvironmentId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

// tslint:disable-next-line:max-line-length
const defaultPreviewApiKey = 'previewApiKey';

const defaultSecuredApiKey = 'securedApiKey';

// ----------- setup function o------------ //
export function setup(context: Context) {
    // get delivery client with given context
    let environmentId: string = defaultenvironmentId;
    let previewApiKey: string = defaultPreviewApiKey;
    let securedApiKey: string = defaultSecuredApiKey;

    // context settings override default setup
    if (context.environmentId) {
        environmentId = context.environmentId;
    }

    if (context.previewApiKey) {
        previewApiKey = context.previewApiKey;
    }

    if (context.securedApiKey) {
        securedApiKey = context.securedApiKey;
    }

    const deliveryClientConfig: IDeliveryClientConfig = {
        environmentId: environmentId,
        secureApiKey: securedApiKey,
        previewApiKey: previewApiKey,
        defaultQueryConfig: context.defaultQueryConfig,
        defaultLanguage: context.defaultLanguage,
        excludeArchivedItems: context.excludeArchivedItems,
        proxy: {
            baseUrl: context.baseUrl,
            basePreviewUrl: context.basePreviewUrl
        },
        retryStrategy: context.retryStrategy,
        globalHeaders: context.globalHeaders
    };

    // set context
    context.environmentId = environmentId;
    context.previewApiKey = previewApiKey;
    context.securedApiKey = securedApiKey;

    // set delivery client
    context.deliveryClient = new DeliveryClient(deliveryClientConfig);
}
