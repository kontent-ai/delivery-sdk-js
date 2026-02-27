import { isPagingQuery, type JsonValue, type PagingQuery, type Query } from "@kontent-ai/core-sdk";
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { expect, it } from "vitest";
import type { ZodType } from "zod";
import type { DeliveryClient, DeliveryClientTypes, DeliveryEndpoints } from "../../lib/models/core.models.js";
import { createDeliveryClient } from "../../lib/public_api.js";
import { getDeliveryUrl } from "../../lib/utils/url.utils.js";
import { getIntegrationTestConfig } from "../integration-tests.config.js";
import { unitEnvironmentId } from "./test.utils.js";

type TestType = "Integration" | "Unit";

export async function runQueryTestsAsync<TResponsePayload extends JsonValue>({
	endpoint,
	unitTestPayload,
	selectQuery,
	expectedSchema,
}: {
	readonly expectedSchema: ZodType<TResponsePayload>;
	readonly endpoint: DeliveryEndpoints;
	readonly unitTestPayload: TResponsePayload;
	readonly selectQuery: (client: DeliveryClient<DeliveryClientTypes>) => Query<TResponsePayload, unknown>;
}): Promise<void> {
	const integrationTestConfig = getIntegrationTestConfig();
	const clients = createTestClients({
		unitTestPayload,
		environmentId: integrationTestConfig.env.id,
		deliveryBaseUrl: integrationTestConfig.env.deliveryBaseUrl,
	});

	for (const client of clients) {
		const { testType, testName } = createTestMetadata({
			clientEnvironmentId: client.config.environmentId,
			integrationEnvironmentId: integrationTestConfig.env.id,
			endpoint,
		});

		const { query, response, success, error } = await executeDefaultQueryAsync({ client, selectQuery });

		registerBaseTests({
			testName,
			endpoint,
			client,
			query,
			response,
			success,
			error,
			expectedSchema,
			unitTestPayload,
			testType,
		});

		if (isPagingQuery(query)) {
			registerPagingTests({
				testName,
				testType,
				unitTestPayload,
				expectedSchema,
				response,
				...(await executePagingQueryAsync<TResponsePayload>({ query })),
			});
		}
	}
}

function createTestClients<TResponsePayload extends JsonValue>({
	unitTestPayload,
	environmentId,
	deliveryBaseUrl,
}: {
	readonly unitTestPayload: TResponsePayload;
	readonly environmentId: string;
	readonly deliveryBaseUrl: string | undefined;
}): readonly DeliveryClient<DeliveryClientTypes>[] {
	return [
		createDeliveryClient(unitEnvironmentId)
			.withUnknownSchema()
			.publicApi()
			.create({
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: unitTestPayload,
					statusCode: 200,
				}),
			}),
		createDeliveryClient(environmentId).withUnknownSchema().publicApi().create({
			baseUrl: deliveryBaseUrl,
		}),
	];
}

function createTestMetadata({
	clientEnvironmentId,
	integrationEnvironmentId,
	endpoint,
}: {
	readonly clientEnvironmentId: string;
	readonly integrationEnvironmentId: string;
	readonly endpoint: DeliveryEndpoints;
}): {
	readonly isIntegrationTest: boolean;
	readonly testType: TestType;
	readonly testName: string;
} {
	const isIntegrationTest = clientEnvironmentId === integrationEnvironmentId;
	const testType = isIntegrationTest ? "Integration" : "Unit";
	const testName = `${testType}[${endpoint}]: `;
	return { isIntegrationTest, testType, testName };
}

function registerBaseTests<TResponsePayload extends JsonValue>({
	testName,
	endpoint,
	client,
	query,
	response,
	success,
	error,
	expectedSchema,
	unitTestPayload,
	testType,
}: {
	readonly testName: string;
	readonly endpoint: DeliveryEndpoints;
	readonly client: DeliveryClient<DeliveryClientTypes>;
	readonly query: Query<TResponsePayload, unknown>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly success: boolean;
	readonly error: unknown;
	readonly expectedSchema: ZodType<TResponsePayload>;
	readonly unitTestPayload: TResponsePayload;
	readonly testType: TestType;
}): void {
	it(`${testName} Expect url to be correct`, () => {
		expect(query.toUrl()).toBe(`${getDeliveryUrl({ apiMode: "public", environmentId: client.config.environmentId, path: endpoint })}`);
	});
	it(`${testName} Response should be successful`, () => {
		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});
	it(`${testName} Response payload should match schema`, async () => {
		const { error: parseError, success: parseSuccess } = await expectedSchema.safeParseAsync(response?.payload);
		expect(parseError).toBeUndefined();
		expect(parseSuccess).toBeTruthy();
	});
	if (testType === "Unit") {
		it(`${testName} Payload should be equal to unit test payload`, () => {
			expect(response?.payload).toEqual(unitTestPayload);
		});
	}
}

function registerPagingTests<TResponsePayload extends JsonValue>({
	testName,
	testType,
	unitTestPayload,
	expectedSchema,
	response,
	pagingResponses,
	pagingSuccess,
	pagingError,
	iteratorPayloads,
	maxPagesCount,
}: {
	readonly testName: string;
	readonly testType: TestType;
	readonly unitTestPayload: TResponsePayload;
	readonly expectedSchema: ZodType<TResponsePayload>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly pagingResponses: readonly { readonly payload: TResponsePayload }[] | undefined;
	readonly pagingSuccess: boolean;
	readonly pagingError: unknown;
	readonly iteratorPayloads: readonly TResponsePayload[];
	readonly maxPagesCount: number;
}): void {
	it(`${testName} Response should be successful`, () => {
		expect(pagingError).toBeUndefined();
		expect(pagingSuccess).toBeTruthy();
	});
	if (testType === "Unit") {
		const firstResponse = pagingResponses?.[0];
		it(`${testName} First paging response payload should match schema`, () => {
			expect(firstResponse?.payload).toEqual(unitTestPayload);
		});
	}
	it(`${testName} First paging response payload should match schema`, async () => {
		const { error: parseError, success: parseSuccess } = await expectedSchema.safeParseAsync(response?.payload);
		expect(parseError).toBeUndefined();
		expect(parseSuccess).toBeTruthy();
	});
	it(`${testName} Iterator responses should be equal to paging responses`, () => {
		expect(iteratorPayloads.length).toEqual(maxPagesCount);
	});
	if (testType === "Unit") {
		const firstIteratorResponse = iteratorPayloads?.[0];
		it(`${testName} First iterator response payload should match schema`, () => {
			expect(firstIteratorResponse).toEqual(unitTestPayload);
		});
	}
}

async function executeDefaultQueryAsync<TResponsePayload extends JsonValue>({
	client,
	selectQuery,
}: {
	readonly client: DeliveryClient<DeliveryClientTypes>;
	readonly selectQuery: (client: DeliveryClient<DeliveryClientTypes>) => Query<TResponsePayload, unknown>;
}): Promise<{
	readonly query: Query<TResponsePayload, unknown>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly success: boolean;
	readonly error: unknown;
}> {
	const query = selectQuery(client);
	const { response, success, error } = await query.toPromise();
	return { query, response, success, error };
}

async function executePagingQueryAsync<TResponsePayload extends JsonValue>({
	query,
}: {
	readonly query: PagingQuery<TResponsePayload, unknown>;
}): Promise<{
	readonly pagingResponses: readonly { readonly payload: TResponsePayload }[] | undefined;
	readonly pagingSuccess: boolean;
	readonly pagingError: unknown;
	readonly iteratorPayloads: readonly TResponsePayload[];
	readonly maxPagesCount: number;
}> {
	const { responses: pagingResponses, success: pagingSuccess, error: pagingError } = await query.toAllPromise();
	const iteratorPayloads: TResponsePayload[] = [];
	const maxPagesCount = 1;
	for await (const pageResponse of query.pages({ maxPagesCount })) {
		iteratorPayloads.push(pageResponse?.payload);
	}
	return {
		pagingResponses,
		pagingSuccess,
		pagingError,
		iteratorPayloads,
		maxPagesCount,
	};
}
