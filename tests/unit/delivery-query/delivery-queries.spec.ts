import type { JsonValue } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import { type ZodType, z } from "zod";
import type { DeliveryClientConfig, FullDeliveryClientSchema } from "../../../lib/models/core.models.js";
import { paginationSchema } from "../../../lib/models/pagination.models.js";
import type { DeliveryRequest, QueryFilters, QueryParameters } from "../../../lib/models/request.models.js";
import {
	createDeliveryFetchQuery,
	createDeliveryPagingByTokenQuery,
	createDeliveryPagingByUrlQuery,
} from "../../../lib/queries/delivery-queries.js";
import { getDeliveryUrl } from "../../../lib/utils/url.utils.js";
import { isFetchQueryWithExpectedFunctions, isPagedFetchQueryWithExpectedFunctions, unitEnvironmentId } from "../../utils/test.utils.js";

const clientConfig: DeliveryClientConfig<FullDeliveryClientSchema> = {
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
		const query = createDeliveryFetchQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint,
		});
		expect(query.url).toBe(getDeliveryUrl({ ...clientConfig, path: endpoint }));
	});

	it("URL has no query string when request is undefined", () => {
		const query = createDeliveryFetchQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items/my_item",
		});
		expect(query.url).not.toContain("?");
	});

	it("URL has no query string when request has neither query nor filters", () => {
		const query = createDeliveryFetchQuery({
			config: clientConfig,
			request: {},
			schema: testSchema,
			endpoint: "items/my_item",
		});
		expect(query.url).not.toContain("?");
	});

	it("URL includes query parameters when request.query is provided", () => {
		const request: DeliveryRequest & QueryParameters<{ readonly language: string; readonly depth: number }> = {
			query: { language: "en-us", depth: 2 },
		};
		const query = createDeliveryFetchQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items/my_item",
		});
		const params = new URL(query.url).searchParams;
		expect(params.get("language")).toBe(request.query?.language);
		expect(params.get("depth")).toBe(request.query?.depth.toString());
	});

	it("URL includes filters when request.filters is provided", () => {
		const request: DeliveryRequest & QueryFilters<string, string> = {
			filters: [{ property: "system.type", operator: "eq", value: "article" }],
		};
		const query = createDeliveryFetchQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items/my_item",
		});
		expect(query.url).toContain(new URLSearchParams("system.type[eq]=article").toString());
	});
});

describe("createDeliveryPagingByUrlQuery", () => {
	it("returns a query with PagedFetchQuery shape", () => {
		const query = createDeliveryPagingByUrlQuery({
			config: clientConfig,
			request: undefined,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(isPagedFetchQueryWithExpectedFunctions(query)).toBeTruthy();
	});

	it("URL matches the delivery URL for the configured endpoint", () => {
		const endpoint = "items" as const;
		const query = createDeliveryPagingByUrlQuery({
			config: clientConfig,
			request: undefined,
			schema: paginationSchema,
			endpoint,
		});
		expect(query.url).toBe(getDeliveryUrl({ ...clientConfig, path: endpoint }));
	});

	it("URL has no query string when request is undefined", () => {
		const query = createDeliveryPagingByUrlQuery({
			config: clientConfig,
			request: undefined,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(query.url).not.toContain("?");
	});

	it("URL has no query string when request has neither query nor filters", () => {
		const request: DeliveryRequest = {};
		const query = createDeliveryPagingByUrlQuery({
			config: clientConfig,
			request,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(query.url).not.toContain("?");
	});

	it("URL includes query parameters when request.query is provided", () => {
		const request: DeliveryRequest & QueryParameters<{ readonly skip: number; readonly limit: number }> = {
			query: { skip: 10, limit: 5 },
		};
		const query = createDeliveryPagingByUrlQuery({
			config: clientConfig,
			request,
			schema: paginationSchema,
			endpoint: "items",
		});
		const params = new URL(query.url).searchParams;
		expect(params.get("skip")).toBe("10");
		expect(params.get("limit")).toBe("5");
	});

	it("URL includes filters when request.filters is provided", () => {
		const request: DeliveryRequest & QueryFilters<string, string> = {
			filters: [{ property: "system.type", operator: "eq", value: "movie" }],
		};
		const query = createDeliveryPagingByUrlQuery({
			config: clientConfig,
			request,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(query.url).toContain(new URLSearchParams("system.type[eq]=movie").toString());
	});
});

describe("createDeliveryPagingByTokenQuery", () => {
	it("returns a query with PagedFetchQuery shape", () => {
		const query = createDeliveryPagingByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(isPagedFetchQueryWithExpectedFunctions(query)).toBeTruthy();
	});

	it("URL matches the delivery URL for the configured endpoint", () => {
		const endpoint = "items-feed" as const;
		const query = createDeliveryPagingByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint,
		});
		expect(query.url).toBe(getDeliveryUrl({ ...clientConfig, path: endpoint }));
	});

	it("URL has no query string when request is undefined", () => {
		const query = createDeliveryPagingByTokenQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(query.url).not.toContain("?");
	});

	it("URL has no query string when request has neither query nor filters", () => {
		const request: DeliveryRequest = {};
		const query = createDeliveryPagingByTokenQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(query.url).not.toContain("?");
	});

	it("URL includes query parameters when request.query is provided", () => {
		const request: DeliveryRequest & QueryParameters<{ readonly language: string }> = {
			query: { language: "en-us" },
		};
		const query = createDeliveryPagingByTokenQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(new URL(query.url).searchParams.get("language")).toBe("en-us");
	});

	it("URL includes filters when request.filters is provided", () => {
		const request: DeliveryRequest & QueryFilters<string, string> = {
			filters: [{ property: "system.type", operator: "eq", value: "blog" }],
		};
		const query = createDeliveryPagingByTokenQuery({
			config: clientConfig,
			request,
			schema: testSchema,
			endpoint: "items-feed",
		});
		expect(query.url).toContain(new URLSearchParams("system.type[eq]=blog").toString());
	});
});
