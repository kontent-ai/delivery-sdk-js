// kentico cloud
import { DeliveryClient, DeliveryClientConfig, TypeResolver } from '../../../lib';

// models
import { Movie } from '../../app/models/movie.class';
import { Actor } from '../../app/models/actor.class';

export var realDeliveryClient = getDeliveryClient();

export var realDeliveryClientConfig = getConfig();

function getDeliveryClient() {
    return new DeliveryClient(getConfig());
};

function getConfig(): DeliveryClientConfig {
    let typeResolvers: TypeResolver[] = [
        new TypeResolver("movie", () => new Movie()),
        new TypeResolver("actor", () => new Actor())
    ];

    let projectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';
    let previewApiKey = 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAidWlkIjogInVzcl8wdlFZQkNxQXZybm81cmlmSG5pWUVHIiwNCiAgImVtYWlsIjogInJpY2hhcmRzQGtlbnRpY28uY29tIiwNCiAgInByb2plY3RfaWQiOiAiZGE1YWJlOWYtZmRhZC00MTY4LTk3Y2QtYjM0NjRiZTJjY2I5IiwNCiAgImp0aSI6ICJpLXNFVWJlNmZPeUtBQmJOIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJnaXZlbl9uYW1lIjogIlJpY2hhcmQiLA0KICAiZmFtaWx5X25hbWUiOiAiU3VzdGVrIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.jSq0owesXGAGf8l7e0Ue7wPkP28MT_--ZK5T02sO7yw';
    return new DeliveryClientConfig(projectId, typeResolvers,
        {
            enablePreviewMode: false,
            previewApiKey: previewApiKey
        })
}

