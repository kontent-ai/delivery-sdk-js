// kentico cloud
import { DeliveryClient, DeliveryClientConfig, TypeResolver } from '../../../lib';

// models
import { Movie } from '../models/movie.class';
import { Actor } from '../models/actor.class';

export function DeliveryClientFactory() {

    let projectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';
    let previewApiKey = 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAidWlkIjogInVzcl8wdlFZQkNxQXZybm81cmlmSG5pWUVHIiwNCiAgImVtYWlsIjogInJpY2hhcmRzQGtlbnRpY28uY29tIiwNCiAgInByb2plY3RfaWQiOiAiZGE1YWJlOWYtZmRhZC00MTY4LTk3Y2QtYjM0NjRiZTJjY2I5IiwNCiAgImp0aSI6ICJ2cGdvRm1GcVRRdFFfZWRjIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJnaXZlbl9uYW1lIjogIlJpY2hhcmQiLA0KICAiZmFtaWx5X25hbWUiOiAiU3VzdGVrIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.LBWv463D3hr_VznmIXoPPWNtXSsMoAloa5pDgMaDKZo';

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("movie", () => new Movie()),
        new TypeResolver("actor", () => new Actor()),
    ];

    return new DeliveryClient(
        new DeliveryClientConfig(projectId, typeResolvers, 
        {
            enablePreviewMode: false,
            previewApiKey: previewApiKey
        })
    )
};

export var DeliveryClientProvider =
    {
        provide: DeliveryClient,
        useFactory: DeliveryClientFactory,
        deps: []
    };
