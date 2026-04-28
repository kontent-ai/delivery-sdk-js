import type { JsonValue } from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type ZodType, z } from "zod";
import type { DefaultDeliveryClientSchema, DeliveryClientConfig } from "../../../lib/models/core.models.js";
import type { Filter } from "../../../lib/models/filter.models.js";
import type { DeliveryRequest } from "../../../lib/models/request.models.js";
import { createDeliveryPagedByTokenQuery } from "../../../lib/queries/delivery-queries.js";
import { getDeliveryUrl } from "../../../lib/utils/url.utils.js";
import { isPagedFetchQueryWithExpectedFunctions, unitEnvironmentId } from "../../utils/test.utils.js";

const clientConfig: DeliveryClientConfig<DefaultDeliveryClientSchema> = {
	apiMode: "public",
	environmentId: unitEnvironmentId,
};

const testSchema: ZodType<JsonValue> = z.object({});

describe("createDeliveryPagingByTokenQuery", () => {
	it("returns a query with PagedFetchQuery shape", () => {
		const query = createDeliveryPagedByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(isPagedFetchQueryWithExpectedFunctions(query)).toBeTruthy();
	});

	it("URL matches the delivery URL for the configured endpoint", () => {
		const endpoint = "items-feed" as const;
		const { inspect } = createDeliveryPagedByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint,
		});
		expect(inspect().data?.url?.toString()).toEqual(new URL(getDeliveryUrl({ ...clientConfig, path: endpoint })).toString());
	});

	it("URL has no query string when request is undefined", () => {
		const { inspect } = createDeliveryPagedByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(inspect().data?.url.toString()).not.toContain("?");
	});

	it("URL has no query string when request has neither query nor filters", () => {
		const request: DeliveryRequest<never, never> = {};
		const { inspect } = createDeliveryPagedByTokenQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(inspect().data?.url.toString()).not.toContain("?");
	});

	it("URL includes query parameters when request.query is provided", () => {
		const request: DeliveryRequest<{ readonly language: string }, never> = {
			query: { language: "en-us" },
		};
		const { inspect } = createDeliveryPagedByTokenQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(inspect().data?.url?.searchParams.get("language")).toBe("en-us");
	});

	it("URL includes filters when request.filters is provided", () => {
		const request: DeliveryRequest<never, readonly Filter<string, string>[]> = {
			filters: [{ property: "system.type", operator: "eq", value: "blog" }],
		};
		const { inspect } = createDeliveryPagedByTokenQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(inspect().data?.url?.toString()).toContain(new URLSearchParams("system.type[eq]=blog").toString());
	});
});

describe("createDeliveryPagingByTokenQuery - continuationToken in meta", () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	it("meta.continuationToken equals the X-Continuation response header value", async () => {
		const token = "abc-continuation-token";
		mockGlobalFetchJsonResponse({ jsonResponse: {}, statusCode: 200, continuationToken: token });

		const { response } = await createDeliveryPagedByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items-feed",
		}).fetchPageSafe();

		expect(response?.meta.continuationToken).toBe(token);
	});

	it("meta.continuationToken is undefined when the X-Continuation response header is absent", async () => {
		mockGlobalFetchJsonResponse({ jsonResponse: {}, statusCode: 200 });

		const { response } = await createDeliveryPagedByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items-feed",
		}).fetchPageSafe();

		expect(response?.meta.continuationToken).toBeUndefined();
	});
});
