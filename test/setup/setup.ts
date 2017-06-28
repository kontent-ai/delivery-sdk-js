// setup
import { Actor, Movie } from '../setup';

// delivery client
import { DeliveryClient, TypeResolver, DeliveryClientConfig} from '../../lib';

// context
import { Context } from './context';

// ---------- default setup ------------- //
var defaultTypeResolvers: TypeResolver[] = [
    new TypeResolver("movie", () => new Movie()),
    new TypeResolver("actor", () => new Actor())
];

var defaultProjectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';
var defaultPreviewApiKey = 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAidWlkIjogInVzcl8wdlFZQkNxQXZybm81cmlmSG5pWUVHIiwNCiAgImVtYWlsIjogInJpY2hhcmRzQGtlbnRpY28uY29tIiwNCiAgInByb2plY3RfaWQiOiAiZGE1YWJlOWYtZmRhZC00MTY4LTk3Y2QtYjM0NjRiZTJjY2I5IiwNCiAgImp0aSI6ICJpLXNFVWJlNmZPeUtBQmJOIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJnaXZlbl9uYW1lIjogIlJpY2hhcmQiLA0KICAiZmFtaWx5X25hbWUiOiAiU3VzdGVrIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.jSq0owesXGAGf8l7e0Ue7wPkP28MT_--ZK5T02sO7yw';

// ----------- setup function o------------ //
export function setup(context: Context) {

    // get delivery client with given context
    var projectId: string = defaultProjectId;
    var previewApiKey: string = defaultPreviewApiKey;
    var typeResolvers: TypeResolver[] = defaultTypeResolvers;

    // context settings override default setup
    if (context.projectId) {
        projectId = context.projectId;
    }

    if (context.previewApiKey) {
        previewApiKey = context.previewApiKey;
    }

    if (context.typeResolvers) {
        typeResolvers = context.typeResolvers;
    }

    var deliveryClientConfig: DeliveryClientConfig = new DeliveryClientConfig(projectId, typeResolvers, {
        previewApiKey: previewApiKey,
        enablePreviewMode: context.usePreviewMode,
        defaultLanguage: context.defaultLanguage
    })

    // set context
    context.projectId = projectId;
    context.previewApiKey = previewApiKey;
    context.typeResolvers = typeResolvers;
    context.defaultLanguage = context.defaultLanguage;

    // set delivery client
    context.deliveryClient = new DeliveryClient(deliveryClientConfig);
}