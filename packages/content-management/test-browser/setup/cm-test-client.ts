import { ContentManagementClient, IContentManagementClient } from '../../lib';
import { TestHttpService } from 'kentico-cloud-core';

export const testProjectId: string = 'fb11eb58-5b77-01b1-2343-a1b57cccc4e1';

// tslint:disable-next-line:max-line-length
export const testProjectIdApiKey: string = '';

export const cmTestClient: IContentManagementClient = new ContentManagementClient({
    projectId: testProjectId,
    // tslint:disable-next-line:max-line-length
    apiKey: testProjectIdApiKey
});

export const getTestClient = (projectId: string, apiKey: string) => new ContentManagementClient({
    apiKey: apiKey,
    projectId: projectId
});

export const cmTestClientWithInvalidApiKey: IContentManagementClient = new ContentManagementClient({
    projectId: testProjectId,
    // tslint:disable-next-line:max-line-length
    apiKey: 'xxx'
});

export const getTestClientWithCloudError: (errorJson: any) => IContentManagementClient = (errorJson: any) => new ContentManagementClient({
    projectId: testProjectId,
    apiKey: 'xxx',
    httpService: new TestHttpService({
        fakeResponseJson: undefined,
        throwCloudError: true,
        errorJson: errorJson
    })
});

export const getTestClientWithJson: (json: any) => IContentManagementClient = (json: any) => new ContentManagementClient({
    projectId: testProjectId,
    apiKey: 'xxx',
    httpService: new TestHttpService({
        fakeResponseJson: json,
        throwCloudError: false
    })
});
