import {
	type BaseUrl,
	type FetchQuery,
	getDefaultHttpService,
	isPagingQuery,
	type JsonValue,
	type KontentSdkError,
	type PagedFetchQuery,
} from "@kontent-ai/core-sdk";
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { expect, it } from "vitest";
import type { ZodMiniType } from "zod/mini";
import type { DeliveryClient, DeliveryClientSchema, DeliveryEndpoint } from "../../lib/models/core.models.js";
import { DeliverySdkError } from "../../lib/models/error.models.js";
import { createDeliveryClient } from "../../lib/public_api.js";
import { getDeliveryUrl } from "../../lib/utils/url.utils.js";
import { getIntegrationTestConfig } from "../integration-tests.config.js";
import { isFetchQueryWithExpectedFunctions, isPagedFetchQueryWithExpectedFunctions, unitEnvironmentId } from "./test.utils.js";

type TestType = "Integration" | "Unit";

type SelectQuery<TResponsePayload extends JsonValue, TSchema extends DeliveryClientSchema> = (
	client: DeliveryClient<TSchema>,
) => FetchQuery<TResponsePayload, KontentSdkError, unknown> | PagedFetchQuery<TResponsePayload, KontentSdkError, unknown>;

export async function runQueryTestsAsync<TResponsePayload extends JsonValue, TSchema extends DeliveryClientSchema>({
	endpoint,
	rawPayload,
	selectQuery,
	expectedSchema,
	extraTests,
}: {
	readonly expectedSchema: ZodMiniType<TResponsePayload>;
	readonly endpoint: DeliveryEndpoint;
	readonly rawPayload: TResponsePayload | undefined;
	readonly selectQuery: SelectQuery<TResponsePayload, TSchema>;
	readonly extraTests?: ((response: TResponsePayload) => void) | undefined;
}): Promise<void> {
	const integrationTestConfig = getIntegrationTestConfig();

	const clients = createTestClients<TResponsePayload, TSchema>({
		rawPayload,
		environmentId: integrationTestConfig.env.id,
		deliveryBaseUrl: integrationTestConfig.env.deliveryBaseUrl,
	});

	for (const client of clients) {
		await runClientQueryTestsAsync({
			client,
			integrationEnvironmentId: integrationTestConfig.env.id,
			endpoint,
			selectQuery,
			expectedSchema,
			rawPayload,
			extraTests,
		});
	}

	await runFailingClientQueryTestAsync({ endpoint, selectQuery });
}

async function runClientQueryTestsAsync<TResponsePayload extends JsonValue, TSchema extends DeliveryClientSchema>({
	client,
	integrationEnvironmentId,
	endpoint,
	selectQuery,
	expectedSchema,
	rawPayload,
	extraTests,
}: {
	readonly client: DeliveryClient<TSchema>;
	readonly integrationEnvironmentId: string;
	readonly endpoint: DeliveryEndpoint;
	readonly selectQuery: SelectQuery<TResponsePayload, TSchema>;
	readonly expectedSchema: ZodMiniType<TResponsePayload>;
	readonly rawPayload: TResponsePayload | undefined;
	readonly extraTests?: ((response: TResponsePayload) => void) | undefined;
}): Promise<void> {
	const { testType, testName } = createTestMetadata({
		clientEnvironmentId: client.config.environmentId,
		integrationEnvironmentId,
		endpoint,
	});

	const { query, response, success, error } = await executeDefaultQueryAsync({ client, selectQuery });

	registerBaseTests({ testName, endpoint, client, query, response, success, error, expectedSchema, rawPayload, testType });

	if (isPagingQuery(query)) {
		const pagingResult = await executePagingQueryAsync<TResponsePayload>({ query });
		registerPagingTests({
			query,
			testName,
			testType,
			rawPayload,
			expectedSchema,
			response,
			...pagingResult,
		});

		if (extraTests) {
			for (const pagingResponse of pagingResult.pagingResponses ?? []) {
				extraTests(pagingResponse.payload);
			}
		}
	} else if (extraTests && response) {
		extraTests(response.payload);
	}
}

function createFailingUnitTestClient<TSchema extends DeliveryClientSchema>(): DeliveryClient<TSchema> {
	return createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		httpService: getDefaultHttpService({
			adapter: {
				executeRequest: () => {
					throw new Error("Simulated failure");
				},
			},
		}),
	});
}

function createUnitTestClient<TResponsePayload extends JsonValue, TSchema extends DeliveryClientSchema>(
	rawPayload: TResponsePayload,
): DeliveryClient<TSchema> {
	return createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		runtimeValidation: {
			validateResponses: true,
		},
		httpService: getTestHttpServiceWithJsonResponse({
			jsonResponse: rawPayload,
			statusCode: 200,
		}),
	});
}

function createIntegrationTestClient<TSchema extends DeliveryClientSchema>(
	environmentId: string,
	deliveryBaseUrl: BaseUrl | undefined,
): DeliveryClient<TSchema> {
	return createDeliveryClient({
		apiMode: "public",
		environmentId,
		runtimeValidation: {
			validateResponses: true,
		},
		...(deliveryBaseUrl ? { baseUrl: deliveryBaseUrl } : {}),
	});
}

function createTestClients<TResponsePayload extends JsonValue, TSchema extends DeliveryClientSchema>({
	rawPayload,
	environmentId,
	deliveryBaseUrl,
}: {
	readonly rawPayload: TResponsePayload | undefined;
	readonly environmentId: string;
	readonly deliveryBaseUrl: BaseUrl | undefined;
}): readonly DeliveryClient<TSchema>[] {
	const integrationClient = createIntegrationTestClient<TSchema>(environmentId, deliveryBaseUrl);
	return rawPayload === undefined
		? [integrationClient]
		: [createUnitTestClient<TResponsePayload, TSchema>(rawPayload), integrationClient];
}

function createTestMetadata({
	clientEnvironmentId,
	integrationEnvironmentId,
	endpoint,
}: {
	readonly clientEnvironmentId: string;
	readonly integrationEnvironmentId: string;
	readonly endpoint: DeliveryEndpoint;
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

function registerBaseTests<TResponsePayload extends JsonValue, TSchema extends DeliveryClientSchema>({
	testName,
	endpoint,
	client,
	query,
	response,
	success,
	error,
	expectedSchema,
	rawPayload,
	testType,
}: {
	readonly testName: string;
	readonly endpoint: DeliveryEndpoint;
	readonly client: DeliveryClient<TSchema>;
	readonly query: ReturnType<SelectQuery<TResponsePayload, TSchema>>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly success: boolean;
	readonly error: unknown;
	readonly expectedSchema: ZodMiniType<TResponsePayload>;
	readonly rawPayload: TResponsePayload;
	readonly testType: TestType;
}): void {
	registerQueryStructureTests({ testName, query, endpoint, client });
	registerResponseValidationTests({ testName, success, error, expectedSchema, response, testType, rawPayload });
}

function registerQueryStructureTests<TResponsePayload extends JsonValue, TSchema extends DeliveryClientSchema>({
	testName,
	query,
	endpoint,
	client,
}: {
	readonly testName: string;
	readonly query: ReturnType<SelectQuery<TResponsePayload, TSchema>>;
	readonly endpoint: DeliveryEndpoint;
	readonly client: DeliveryClient<TSchema>;
}): void {
	it(`${testName} Expect url to be correct`, () => {
		expect(query.inspect()?.data?.url).toEqual(
			new URL(getDeliveryUrl({ apiMode: "public", environmentId: client.config.environmentId, path: endpoint })),
		);
	});
	if (!isPagingQuery(query)) {
		it(`${testName} Query should be a fetch query with expected functions`, () => {
			expect(isFetchQueryWithExpectedFunctions(query)).toBeTruthy();
		});
	}
}

function registerResponseValidationTests<TResponsePayload extends JsonValue>({
	testName,
	success,
	error,
	expectedSchema,
	response,
	testType,
	rawPayload,
}: {
	readonly testName: string;
	readonly success: boolean;
	readonly error: unknown;
	readonly expectedSchema: ZodMiniType<TResponsePayload>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly testType: TestType;
	readonly rawPayload: TResponsePayload;
}): void {
	it(`${testName} Response should be successful`, () => {
		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});
	it(`${testName} Response payload should match schema`, async () => {
		const { error: parseError, success: parseSuccess } = await expectedSchema.safeParseAsync(response?.payload);
		expect(parseError).toBeUndefined();
		expect(parseSuccess).toBeTruthy();
	});
	if (testType === "Unit" && rawPayload) {
		it(`${testName} Payload should be equal to unit test payload`, () => {
			expect(response?.payload).toEqual(rawPayload);
		});
	}
}

function registerPagingTests<TResponsePayload extends JsonValue>({
	query,
	testName,
	testType,
	rawPayload,
	expectedSchema,
	response,
	pagingResponses,
	pagingSuccess,
	pagingError,
	iteratorPayloads,
	maxPagesCount,
}: {
	readonly query: PagedFetchQuery<TResponsePayload, KontentSdkError, unknown>;
	readonly testName: string;
	readonly testType: TestType;
	readonly rawPayload: TResponsePayload;
	readonly expectedSchema: ZodMiniType<TResponsePayload>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly pagingResponses: readonly { readonly payload: TResponsePayload }[] | undefined;
	readonly pagingSuccess: boolean;
	readonly pagingError: unknown;
	readonly iteratorPayloads: readonly TResponsePayload[];
	readonly maxPagesCount: number;
}): void {
	registerPagingResponseTests({
		testName,
		pagingSuccess,
		pagingError,
		expectedSchema,
		response,
		testType,
		pagingResponses,
		rawPayload,
	});
	registerPagingIteratorTests({ testName, query, iteratorPayloads, maxPagesCount, testType, rawPayload });
}

function registerPagingResponseTests<TResponsePayload extends JsonValue>({
	testName,
	pagingSuccess,
	pagingError,
	expectedSchema,
	response,
	testType,
	pagingResponses,
	rawPayload,
}: {
	readonly testName: string;
	readonly pagingSuccess: boolean;
	readonly pagingError: unknown;
	readonly expectedSchema: ZodMiniType<TResponsePayload>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly testType: TestType;
	readonly pagingResponses: readonly { readonly payload: TResponsePayload }[] | undefined;
	readonly rawPayload: TResponsePayload;
}): void {
	it(`${testName} Response should be successful`, () => {
		expect(pagingError).toBeUndefined();
		expect(pagingSuccess).toBeTruthy();
	});
	it(`${testName} First paging response payload should match schema`, async () => {
		const { error: parseError, success: parseSuccess } = await expectedSchema.safeParseAsync(response?.payload);
		expect(parseError).toBeUndefined();
		expect(parseSuccess).toBeTruthy();
	});
	if (testType === "Unit") {
		const firstResponse = pagingResponses?.[0];
		it(`${testName} First paging response payload should match unit test payload`, () => {
			expect(firstResponse?.payload).toEqual(rawPayload);
		});
	}
}

function registerPagingIteratorTests<TResponsePayload extends JsonValue>({
	testName,
	query,
	iteratorPayloads,
	maxPagesCount,
	testType,
	rawPayload,
}: {
	readonly testName: string;
	readonly query: PagedFetchQuery<TResponsePayload, KontentSdkError, unknown>;
	readonly iteratorPayloads: readonly TResponsePayload[];
	readonly maxPagesCount: number;
	readonly testType: TestType;
	readonly rawPayload: TResponsePayload;
}): void {
	it(`${testName} Iterator responses should be equal to paging responses`, () => {
		expect(iteratorPayloads.length).toEqual(maxPagesCount);
	});
	it(`${testName} Query should be a paged fetch query with expected functions`, () => {
		expect(isPagedFetchQueryWithExpectedFunctions(query)).toBeTruthy();
	});
	if (testType === "Unit") {
		const firstIteratorResponse = iteratorPayloads?.[0];
		it(`${testName} First iterator response payload should match schema`, () => {
			expect(firstIteratorResponse).toEqual(rawPayload);
		});
	}
}

async function runFailingClientQueryTestAsync<TResponsePayload extends JsonValue, TSchema extends DeliveryClientSchema>({
	endpoint,
	selectQuery,
}: {
	readonly endpoint: DeliveryEndpoint;
	readonly selectQuery: SelectQuery<TResponsePayload, TSchema>;
}): Promise<void> {
	const client = createFailingUnitTestClient<TSchema>();
	const query = selectQuery(client);
	const { error } = isPagingQuery(query) ? await query.fetchPageSafe() : await query.fetchSafe();
	const testName = `Unit[${endpoint}]: `;

	it(`${testName} Error should be an instance of DeliverySdkError`, () => {
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
}

async function executeDefaultQueryAsync<TResponsePayload extends JsonValue, TSchema extends DeliveryClientSchema>({
	client,
	selectQuery,
}: {
	readonly client: DeliveryClient<TSchema>;
	readonly selectQuery: SelectQuery<TResponsePayload, TSchema>;
}): Promise<{
	readonly query: ReturnType<SelectQuery<TResponsePayload, TSchema>>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly success: boolean;
	readonly error: unknown;
}> {
	const query = selectQuery(client);
	if (isPagingQuery(query)) {
		const { response, success, error } = await query.fetchPageSafe();
		return { query, response, success, error };
	}
	const { response, success, error } = await query.fetchSafe();
	return { query, response, success, error };
}

async function executePagingQueryAsync<TResponsePayload extends JsonValue>({
	query,
}: {
	readonly query: PagedFetchQuery<TResponsePayload, KontentSdkError, unknown>;
}): Promise<{
	readonly pagingResponses: readonly { readonly payload: TResponsePayload }[] | undefined;
	readonly pagingSuccess: boolean;
	readonly pagingError: unknown;
	readonly iteratorPayloads: readonly TResponsePayload[];
	readonly maxPagesCount: number;
}> {
	const { responses: pagingResponses, success: pagingSuccess, error: pagingError } = await query.fetchAllPagesSafe();
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
