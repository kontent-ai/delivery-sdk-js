// kentico cloud
import { DeliveryClient, DeliveryClientConfig, TypeResolver } from '../../../lib';

// models
import { Character } from '../models/character.class';
import { Author } from '../models/author.class';
import { Category } from '../models/category.class';
import { CodeExample } from '../models/code-example.class';
import { DeeperCategory } from '../models/deeper-category';

export function DeliveryClientFactory() {

    let projectId = 'b52fa0db-84ec-4310-8f7c-3b94ed06644d';
    let previewApiKey = 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAidWlkIjogInVzcl8wdlFZQkNxQXZybm81cmlmSG5pWUVHIiwNCiAgImVtYWlsIjogInJpY2hhcmRzQGtlbnRpY28uY29tIiwNCiAgInByb2plY3RfaWQiOiAiYjUyZmEwZGItODRlYy00MzEwLThmN2MtM2I5NGVkMDY2NDRkIiwNCiAgImp0aSI6ICI0aWxidVJmSnVpWFZjV0tDIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJnaXZlbl9uYW1lIjogIlJpY2hhcmQiLA0KICAiZmFtaWx5X25hbWUiOiAiU3VzdGVrIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.T4BjQJOGvkAUwEjdDfqdin8PzkZntGnt-T2YKITeHrw';

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("code_example", () => new CodeExample()),
        new TypeResolver("category", () => new Category()),
        new TypeResolver("author", () => new Author()),
        new TypeResolver("character", () => new Character()),
        new TypeResolver("deeper_category", () => new DeeperCategory()),
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
