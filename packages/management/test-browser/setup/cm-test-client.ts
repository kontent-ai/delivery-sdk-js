import { IManagementClient, ManagementClient } from '../../lib';
import { TestHttpService } from '@kentico/kontent-core';

export const testProjectId: string = 'fb11eb58-5b77-01b1-2343-a1b57cccc4e1';

// tslint:disable-next-line:max-line-length
export const testProjectIdApiKey: string = '';

export const cmTestClient: IManagementClient = new ManagementClient({
    projectId: testProjectId,
    // tslint:disable-next-line:max-line-length
    apiKey: testProjectIdApiKey
});

export const getTestClient = (projectId: string, apiKey: string) => new ManagementClient({
    apiKey: apiKey,
    projectId: projectId
});

export const cmTestClientWithInvalidApiKey: IManagementClient = new ManagementClient({
    projectId: testProjectId,
    // tslint:disable-next-line:max-line-length
    apiKey: 'xxx'
});

export const getTestClientWithBaseKontentError: (errorJson: any) => IManagementClient = (errorJson: any) => new ManagementClient({
    projectId: testProjectId,
    apiKey: 'xxx',
    httpService: new TestHttpService({
        fakeResponseJson: undefined,
        throwError: true,
        errorJson: errorJson
    })
});

export const getTestClientWithJson: (json: any) => IManagementClient = (json: any) => new ManagementClient({
    projectId: testProjectId,
    apiKey: 'xxx',
    httpService: new TestHttpService({
        fakeResponseJson: json,
        throwError: false
    })
});
