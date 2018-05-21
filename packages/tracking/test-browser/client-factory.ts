import { TrackingClient } from '../lib';

export function createTestClient(): TrackingClient {
    return new TrackingClient({
        projectId: '11577e0b-fda9-01dc-a7bd-a5f9e8e57297',
    });
}

