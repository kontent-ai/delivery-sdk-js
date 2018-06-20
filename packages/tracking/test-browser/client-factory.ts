import { TrackingClient, ITrackingClientConfig } from '../lib';

export function createTestClient(config?: {
    baseUrl?: string
}): TrackingClient {
    return new TrackingClient({
        projectId: '11577e0b-fda9-01dc-a7bd-a5f9e8e57297',
        baseUrl: config && config.baseUrl ? config.baseUrl : undefined
    });
}

