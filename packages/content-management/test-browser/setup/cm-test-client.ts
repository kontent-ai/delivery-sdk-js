import { ContentManagementClient, IContentManagementClient } from '../../lib';

export const testProjectId: string = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

// tslint:disable-next-line:max-line-length
export const testProjectIdApiKey: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkYzBlNDA1N2IyMmU0N2Y3YmY5NjhkNTk0NDAyZTQ3MCIsImlhdCI6IjE1NDA4OTI4NTAiLCJleHAiOiIxNTQ4NjY4ODUwIiwicHJvamVjdF9pZCI6ImRhNWFiZTlmZmRhZDQxNjg5N2NkYjM0NjRiZTJjY2I5IiwidmVyIjoiMi4xLjAiLCJ1aWQiOiJ1c3JfMHZRWUJDcUF2cm5vNXJpZkhuaVlFRyIsImF1ZCI6Im1hbmFnZS5rZW50aWNvY2xvdWQuY29tIn0.LKnn7UmrxYUtekRXnvgov-x5slDm07EM8YK_R2JMqGY';

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

