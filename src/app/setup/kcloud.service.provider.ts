// core
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

// kentico cloud
import { KCloudService, KCloudConfig, TypeResolver } from '../../../index';

// models
import { Character } from '../models/character.class';
import { Author } from '../models/author.class';
import { Category } from '../models/category.class';
import { CodeExample } from '../models/code-example.class';

export function KCloudServiceFactory(http: Http) {

    let apiUrl = 'https://deliver.kenticocloud.com';
    let projectId = 'b52fa0db-84ec-4310-8f7c-3b94ed06644d';

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("code_example", () => new CodeExample()),
        new TypeResolver("category", () => new Category()),
        new TypeResolver("author", () => new Author()),
        new TypeResolver("character", () => new Character()),
    ];

    return new KCloudService(
        http,
        new KCloudConfig(apiUrl, projectId, typeResolvers)
    )
};

export var KCloudServiceProvider =
    {
        provide: KCloudService,
        useFactory: KCloudServiceFactory,
        deps: [Http]
    };

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        KCloudService,
    ],
})
export class KenticoCloudModule { }