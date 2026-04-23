import type { JsonValue } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import { type ZodType, z } from "zod";
import type { DefaultDeliveryClientSchema, DeliveryClientConfig } from "../../../lib/models/core.models.js";
import type { Filter } from "../../../lib/models/filter.models.js";
import { paginationSchema } from "../../../lib/models/pagination.models.js";
import type { DeliveryRequest } from "../../../lib/models/request.models.js";
import { createDeliveryFetchQuery, createPagedByTokenQuery, createPagedByUrlQuery } from "../../../lib/queries/delivery-queries.js";
import { getDeliveryUrl } from "../../../lib/utils/url.utils.js";
import { isFetchQueryWithExpectedFunctions, isPagedFetchQueryWithExpectedFunctions, unitEnvironmentId } from "../../utils/test.utils.js";

const clientConfig: DeliveryClientConfig<DefaultDeliveryClientSchema> = {
	apiMode: "public",
	environmentId: unitEnvironmentId,
};

const testSchema: ZodType<JsonValue> = z.object({});

describe("createDeliveryFetchQuery", () => {
	it("returns a query with FetchQuery shape", () => {
		const query = createDeliveryFetchQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items/my_item",
		});
		expect(isFetchQueryWithExpectedFunctions(query)).toBeTruthy();
	});

	it("URL matches the delivery URL for the configured endpoint", () => {
		const endpoint = "items/my_item";
		const { inspect } = createDeliveryFetchQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint,
		});
		expect(inspect().data?.url?.toString()).toEqual(new URL(getDeliveryUrl({ ...clientConfig, path: endpoint })).toString());
	});

	it("URL has no query string when request is undefined", () => {
		const { inspect } = createDeliveryFetchQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items/my_item",
		});
		expect(inspect().data?.url?.toString()).not.toContain("?");
	});

	it("URL has no query string when request has neither query nor filters", () => {
		const { inspect } = createDeliveryFetchQuery({
			config: clientConfig,
			request: {},
			schema: testSchema,
			endpoint: "items/my_item",
		});
		expect(inspect().data?.url?.toString()).not.toContain("?");
	});

	it("URL includes query parameters when request.query is provided", () => {
		const request: DeliveryRequest<{ readonly language: string; readonly depth: number }, never> = {
			query: { language: "en-us", depth: 2 },
		};
		const { inspect } = createDeliveryFetchQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items/my_item",
		});

		const url = inspect().data?.url;
		expect(url?.searchParams.get("language")).toBe(request.query?.language);
		expect(url?.searchParams.get("depth")).toBe(request.query?.depth.toString());
	});

	it("URL includes filters when request.filters is provided", () => {
		const request: DeliveryRequest<never, readonly Filter<string, string>[]> = {
			filters: [{ property: "system.type", operator: "eq", value: "article" }],
		};
		const { inspect } = createDeliveryFetchQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items/my_item",
		});
		expect(inspect().data?.url?.toString()).toContain(new URLSearchParams("system.type[eq]=article").toString());
	});
});

describe("createDeliveryPagingByUrlQuery", () => {
	it("returns a query with PagedFetchQuery shape", () => {
		const query = createPagedByUrlQuery({
			config: clientConfig,
			request: undefined,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(isPagedFetchQueryWithExpectedFunctions(query)).toBeTruthy();
	});

	it("URL matches the delivery URL for the configured endpoint", () => {
		const endpoint = "items" as const;
		const { inspect } = createPagedByUrlQuery({
			config: clientConfig,
			request: undefined,
			schema: paginationSchema,
			endpoint,
		});
		expect(inspect().data?.url?.toString()).toEqual(new URL(getDeliveryUrl({ ...clientConfig, path: endpoint })).toString());
	});

	it("URL has no query string when request is undefined", () => {
		const { inspect } = createPagedByUrlQuery({
			config: clientConfig,
			request: undefined,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(inspect().data?.url?.toString()).not.toContain("?");
	});

	it("URL has no query string when request has neither query nor filters", () => {
		const request: DeliveryRequest<never, never> = {};
		const { inspect } = createPagedByUrlQuery({
			config: clientConfig,
			request,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(inspect().data?.url?.toString()).not.toContain("?");
	});

	it("URL includes query parameters when request.query is provided", () => {
		const request: DeliveryRequest<{ readonly skip: number; readonly limit: number }, never> = {
			query: { skip: 10, limit: 5 },
		};
		const { inspect } = createPagedByUrlQuery({
			config: clientConfig,
			request,
			schema: paginationSchema,
			endpoint: "items",
		});

		const url = inspect().data?.url;
		expect(url?.searchParams.get("skip")).toBe("10");
		expect(url?.searchParams.get("limit")).toBe("5");
	});

	it("URL includes filters when request.filters is provided", () => {
		const request: DeliveryRequest<never, readonly Filter<string, string>[]> = {
			filters: [{ property: "system.type", operator: "eq", value: "movie" }],
		};
		const { inspect } = createPagedByUrlQuery({
			config: clientConfig,
			request,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(inspect().data?.url?.toString()).toContain(new URLSearchParams("system.type[eq]=movie").toString());
	});
});

describe("createDeliveryPagingByTokenQuery", () => {
	it("returns a query with PagedFetchQuery shape", () => {
		const query = createPagedByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(isPagedFetchQueryWithExpectedFunctions(query)).toBeTruthy();
	});

	it("URL matches the delivery URL for the configured endpoint", () => {
		const endpoint = "items-feed" as const;
		const { inspect } = createPagedByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint,
		});
		expect(inspect().data?.url?.toString()).toEqual(new URL(getDeliveryUrl({ ...clientConfig, path: endpoint })).toString());
	});

	it("URL has no query string when request is undefined", () => {
		const { inspect } = createPagedByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(inspect().data?.url.toString()).not.toContain("?");
	});

	it("URL has no query string when request has neither query nor filters", () => {
		const request: DeliveryRequest<never, never> = {};
		const { inspect } = createPagedByTokenQuery({
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
		const { inspect } = createPagedByTokenQuery({
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
		const { inspect } = createPagedByTokenQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(inspect().data?.url?.toString()).toContain(new URLSearchParams("system.type[eq]=blog").toString());
	});
});
