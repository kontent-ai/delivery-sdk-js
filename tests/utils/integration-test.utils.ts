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
import type { ZodType } from "zod";
import type { DeliveryClient, DeliveryClientSchema, DeliveryEndpoints } from "../../lib/models/core.models.js";
import { DeliverySdkError } from "../../lib/models/error.models.js";
import { createDeliveryClient } from "../../lib/public_api.js";
import { getDeliveryUrl } from "../../lib/utils/url.utils.js";
import { getIntegrationTestConfig } from "../integration-tests.config.js";
import { isFetchQueryWithExpectedFunctions, isPagedFetchQueryWithExpectedFunctions, unitEnvironmentId } from "./test.utils.js";

type TestType = "Integration" | "Unit";

type SelectQuery<TResponsePayload extends JsonValue> = (
	client: DeliveryClient<DeliveryClientSchema>,
) => FetchQuery<TResponsePayload, unknown, KontentSdkError> | PagedFetchQuery<TResponsePayload, unknown, KontentSdkError>;

export function getIntegrationTestsSchema(): DeliveryClientSchema {
	return {
		languageCodenames: [],
		taxonomyCodenames: [],
		contentTypeCodenames: [],
		elementCodenames: [],
		collectionCodenames: [],
		workflowCodenames: [],
		workflowStepCodenames: [],
	};
}

export async function runQueryTestsAsync<TResponsePayload extends JsonValue>({
	endpoint,
	unitTestPayload,
	selectQuery,
	expectedSchema,
}: {
	readonly expectedSchema: ZodType<TResponsePayload>;
	readonly endpoint: DeliveryEndpoints;
	readonly unitTestPayload: TResponsePayload;
	readonly selectQuery: SelectQuery<TResponsePayload>;
}): Promise<void> {
	const integrationTestConfig = getIntegrationTestConfig();

	const clients = createTestClients({
		unitTestPayload,
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
			unitTestPayload,
		});
	}

	await runFailingClientQueryTestAsync({ endpoint, selectQuery });
}

async function runClientQueryTestsAsync<TResponsePayload extends JsonValue>({
	client,
	integrationEnvironmentId,
	endpoint,
	selectQuery,
	expectedSchema,
	unitTestPayload,
}: {
	readonly client: DeliveryClient<DeliveryClientSchema>;
	readonly integrationEnvironmentId: string;
	readonly endpoint: DeliveryEndpoints;
	readonly selectQuery: SelectQuery<TResponsePayload>;
	readonly expectedSchema: ZodType<TResponsePayload>;
	readonly unitTestPayload: TResponsePayload;
}): Promise<void> {
	const { testType, testName } = createTestMetadata({
		clientEnvironmentId: client.config.environmentId,
		integrationEnvironmentId,
		endpoint,
	});

	const { query, response, success, error } = await executeDefaultQueryAsync({ client, selectQuery });

	registerBaseTests({ testName, endpoint, client, query, response, success, error, expectedSchema, unitTestPayload, testType });

	if (isPagingQuery(query)) {
		registerPagingTests({
			query,
			testName,
			testType,
			unitTestPayload,
			expectedSchema,
			response,
			...(await executePagingQueryAsync<TResponsePayload>({ query })),
		});
	}
}

function createFailingUnitTestClient(): DeliveryClient<DeliveryClientSchema> {
	return createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		schema: {
			languageCodenames: [],
			taxonomyCodenames: [],
			contentTypeCodenames: [],
			elementCodenames: [],
			collectionCodenames: [],
			workflowCodenames: [],
			workflowStepCodenames: [],
		},
		httpService: getDefaultHttpService({
			adapter: {
				executeRequest: () => {
					throw new Error("Simulated failure");
				},
			},
		}),
	});
}

function createUnitTestClient<TResponsePayload extends JsonValue>(unitTestPayload: TResponsePayload): DeliveryClient<DeliveryClientSchema> {
	return createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		schema: {
			languageCodenames: [],
			taxonomyCodenames: [],
			contentTypeCodenames: [],
			elementCodenames: [],
			collectionCodenames: [],
			workflowCodenames: [],
			workflowStepCodenames: [],
		},
		httpService: getTestHttpServiceWithJsonResponse({
			jsonResponse: unitTestPayload,
			statusCode: 200,
		}),
	});
}

function createIntegrationTestClient(environmentId: string, deliveryBaseUrl: BaseUrl | undefined): DeliveryClient<DeliveryClientSchema> {
	return createDeliveryClient({
		apiMode: "public",
		environmentId,
		schema: {
			languageCodenames: [],
			taxonomyCodenames: [],
			contentTypeCodenames: [],
			elementCodenames: [],
			collectionCodenames: [],
			workflowCodenames: [],
			workflowStepCodenames: [],
		},
		...(deliveryBaseUrl ? { baseUrl: deliveryBaseUrl } : {}),
	});
}

function createTestClients<TResponsePayload extends JsonValue>({
	unitTestPayload,
	environmentId,
	deliveryBaseUrl,
}: {
	readonly unitTestPayload: TResponsePayload;
	readonly environmentId: string;
	readonly deliveryBaseUrl: BaseUrl | undefined;
}): readonly DeliveryClient<DeliveryClientSchema>[] {
	return [createUnitTestClient(unitTestPayload), createIntegrationTestClient(environmentId, deliveryBaseUrl)];
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
	readonly client: DeliveryClient<DeliveryClientSchema>;
	readonly query: ReturnType<SelectQuery<TResponsePayload>>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly success: boolean;
	readonly error: unknown;
	readonly expectedSchema: ZodType<TResponsePayload>;
	readonly unitTestPayload: TResponsePayload;
	readonly testType: TestType;
}): void {
	registerQueryStructureTests({ testName, query, endpoint, client });
	registerResponseValidationTests({ testName, success, error, expectedSchema, response, testType, unitTestPayload });
}

function registerQueryStructureTests<TResponsePayload extends JsonValue>({
	testName,
	query,
	endpoint,
	client,
}: {
	readonly testName: string;
	readonly query: ReturnType<SelectQuery<TResponsePayload>>;
	readonly endpoint: DeliveryEndpoints;
	readonly client: DeliveryClient<DeliveryClientSchema>;
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
	unitTestPayload,
}: {
	readonly testName: string;
	readonly success: boolean;
	readonly error: unknown;
	readonly expectedSchema: ZodType<TResponsePayload>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly testType: TestType;
	readonly unitTestPayload: TResponsePayload;
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
	if (testType === "Unit") {
		it(`${testName} Payload should be equal to unit test payload`, () => {
			expect(response?.payload).toEqual(unitTestPayload);
		});
	}
}

function registerPagingTests<TResponsePayload extends JsonValue>({
	query,
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
	readonly query: PagedFetchQuery<TResponsePayload, unknown, KontentSdkError>;
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
	registerPagingResponseTests({
		testName,
		pagingSuccess,
		pagingError,
		expectedSchema,
		response,
		testType,
		pagingResponses,
		unitTestPayload,
	});
	registerPagingIteratorTests({ testName, query, iteratorPayloads, maxPagesCount, testType, unitTestPayload });
}

function registerPagingResponseTests<TResponsePayload extends JsonValue>({
	testName,
	pagingSuccess,
	pagingError,
	expectedSchema,
	response,
	testType,
	pagingResponses,
	unitTestPayload,
}: {
	readonly testName: string;
	readonly pagingSuccess: boolean;
	readonly pagingError: unknown;
	readonly expectedSchema: ZodType<TResponsePayload>;
	readonly response: { readonly payload: TResponsePayload } | undefined;
	readonly testType: TestType;
	readonly pagingResponses: readonly { readonly payload: TResponsePayload }[] | undefined;
	readonly unitTestPayload: TResponsePayload;
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
			expect(firstResponse?.payload).toEqual(unitTestPayload);
		});
	}
}

function registerPagingIteratorTests<TResponsePayload extends JsonValue>({
	testName,
	query,
	iteratorPayloads,
	maxPagesCount,
	testType,
	unitTestPayload,
}: {
	readonly testName: string;
	readonly query: PagedFetchQuery<TResponsePayload, unknown, KontentSdkError>;
	readonly iteratorPayloads: readonly TResponsePayload[];
	readonly maxPagesCount: number;
	readonly testType: TestType;
	readonly unitTestPayload: TResponsePayload;
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
			expect(firstIteratorResponse).toEqual(unitTestPayload);
		});
	}
}

async function runFailingClientQueryTestAsync<TResponsePayload extends JsonValue>({
	endpoint,
	selectQuery,
}: {
	readonly endpoint: DeliveryEndpoints;
	readonly selectQuery: SelectQuery<TResponsePayload>;
}): Promise<void> {
	const client = createFailingUnitTestClient();
	const query = selectQuery(client);
	const { error } = isPagingQuery(query) ? await query.fetchPageSafe() : await query.fetchSafe();
	const testName = `Unit[${endpoint}]: `;

	it(`${testName} Error should be an instance of DeliverySdkError`, () => {
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
}

async function executeDefaultQueryAsync<TResponsePayload extends JsonValue>({
	client,
	selectQuery,
}: {
	readonly client: DeliveryClient<DeliveryClientSchema>;
	readonly selectQuery: SelectQuery<TResponsePayload>;
}): Promise<{
	readonly query: ReturnType<SelectQuery<TResponsePayload>>;
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
	readonly query: PagedFetchQuery<TResponsePayload, unknown, KontentSdkError>;
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
