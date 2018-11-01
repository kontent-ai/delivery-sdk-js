import { ContentManagementClient, IContentManagementClient } from '../../lib';
import { CMTestHttpService } from './cm-test-http-service';

export const testProjectId: string = 'fb11eb58-5b77-01b1-2343-a1b57cccc4e1';

// tslint:disable-next-line:max-line-length
export const testProjectIdApiKey: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5MTUwZTM5ZWEzZTQ0ZDE4YTg4MjY2YTg4N2ZjMjAyNCIsImlhdCI6IjE1NDEwNTYzMDAiLCJleHAiOiIxNTQ4ODMyMzAwIiwicHJvamVjdF9pZCI6ImZiMTFlYjU4NWI3NzAxYjEyMzQzYTFiNTdjY2NjNGUxIiwidmVyIjoiMi4xLjAiLCJ1aWQiOiJ1c3JfMHZRWUJDcUF2cm5vNXJpZkhuaVlFRyIsImF1ZCI6Im1hbmFnZS5rZW50aWNvY2xvdWQuY29tIn0.hrxsrhPfMwZ2gLENdXH5T2D0G732H_z_3xRLP_d9mSY';

export const cmTestClient: IContentManagementClient = new ContentManagementClient({
    projectId: testProjectId,
    // tslint:disable-next-line:max-line-length
    apiKey: testProjectIdApiKey
});

export const cmTestClientWithInvalidApiKey: IContentManagementClient = new ContentManagementClient({
    projectId: testProjectId,
    // tslint:disable-next-line:max-line-length
    apiKey: 'xxx'
});

export const getTestClientWithCloudError: (errorJson: any) => IContentManagementClient = (errorJson: any) => new ContentManagementClient({
    projectId: testProjectId,
    apiKey: 'xxx',
    httpService: new CMTestHttpService({
        fakeResponseJson: undefined,
        throwCloudError: true,
        errorJson: errorJson
    })
});

export const getTestClientWithJson: (json: any) => IContentManagementClient = (json: any) => new ContentManagementClient({
    projectId: testProjectId,
    apiKey: 'xxx',
    httpService: new CMTestHttpService({
        fakeResponseJson: json,
        throwCloudError: false
    })
});
