import { DeliveryClient, IDeliveryClientConfig, PropertyNameResolver } from '../../../lib';
import { Context } from './context';

const defaultProjectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

// tslint:disable-next-line:max-line-length
const defaultPreviewApiKey = 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAidWlkIjogInVzcl8wdlFZQkNxQXZybm81cmlmSG5pWUVHIiwNCiAgImVtYWlsIjogInJpY2hhcmRzQGtlbnRpY28uY29tIiwNCiAgInByb2plY3RfaWQiOiAiZGE1YWJlOWYtZmRhZC00MTY4LTk3Y2QtYjM0NjRiZTJjY2I5IiwNCiAgImp0aSI6ICJpLXNFVWJlNmZPeUtBQmJOIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJnaXZlbl9uYW1lIjogIlJpY2hhcmQiLA0KICAiZmFtaWx5X25hbWUiOiAiU3VzdGVrIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.jSq0owesXGAGf8l7e0Ue7wPkP28MT_--ZK5T02sO7yw';

const defaultSecuredApiKey = 'securedApiKey';

const defaultPropertyNameResolver: PropertyNameResolver = (type, element) => {
    if (type === 'actor') {
        if (element === 'first_name') {
            return 'firstName';
        }
        if (element === 'last_name') {
            return 'lastName';
        }
    }

    if (type === 'movie') {
        if (element === 'releasecategory') {
            return 'releaseCategory';
        }
    }

    return element;
};

// ----------- setup function o------------ //
export function setup(context: Context) {

    // get delivery client with given context
    let projectId: string = defaultProjectId;
    let previewApiKey: string = defaultPreviewApiKey;
    let securedApiKey: string = defaultSecuredApiKey;
    let propertyNameResolver: PropertyNameResolver = defaultPropertyNameResolver;

    // context settings override default setup
    if (context.projectId) {
        projectId = context.projectId;
    }

    if (context.previewApiKey) {
        previewApiKey = context.previewApiKey;
    }

    if (context.securedApiKey) {
        securedApiKey = context.securedApiKey;
    }

    if (context.propertyNameResolver) {
        propertyNameResolver = context.propertyNameResolver;
    }

    const deliveryClientConfig: IDeliveryClientConfig = {
        projectId: projectId,
        propertyNameResolver: propertyNameResolver,
        secureApiKey: securedApiKey,
        previewApiKey: previewApiKey,
        globalQueryConfig: context.globalQueryConfig,
        defaultLanguage: context.defaultLanguage,
        proxy: {
            baseUrl: context.baseUrl,
            basePreviewUrl: context.basePreviewUrl,
        },
        retryStrategy: context.retryStrategy,
        globalHeaders: context.globalHeaders,
    };

    // set context
    context.projectId = projectId;
    context.previewApiKey = previewApiKey;
    context.propertyNameResolver = propertyNameResolver;
    context.securedApiKey = securedApiKey;

    // set delivery client
    context.deliveryClient = new DeliveryClient(deliveryClientConfig);
}
