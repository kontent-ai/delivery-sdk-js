import { describe, expect, it } from "vitest";
import type { DefaultDeliveryClientSchema, DeliveryClientConfig } from "../../../lib/models/core.models.js";
import type { Filter } from "../../../lib/models/filter.models.js";
import { paginationSchema } from "../../../lib/models/pagination.models.js";
import type { DeliveryRequest } from "../../../lib/models/request.models.js";
import { createDeliveryPagedByUrlQuery } from "../../../lib/queries/delivery-queries.js";
import { getDeliveryUrl } from "../../../lib/utils/url.utils.js";
import { isPagedFetchQueryWithExpectedFunctions, unitEnvironmentId } from "../../utils/test.utils.js";

const clientConfig: DeliveryClientConfig<DefaultDeliveryClientSchema> = {
	apiMode: "public",
	environmentId: unitEnvironmentId,
};

describe("createDeliveryPagingByUrlQuery", () => {
	it("returns a query with PagedFetchQuery shape", () => {
		const query = createDeliveryPagedByUrlQuery({
			config: clientConfig,
			request: undefined,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(isPagedFetchQueryWithExpectedFunctions(query)).toBeTruthy();
	});

	it("URL matches the delivery URL for the configured endpoint", () => {
		const endpoint = "items" as const;
		const { inspect } = createDeliveryPagedByUrlQuery({
			config: clientConfig,
			request: undefined,
			schema: paginationSchema,
			endpoint,
		});
		expect(inspect().data?.url?.toString()).toEqual(new URL(getDeliveryUrl({ ...clientConfig, path: endpoint })).toString());
	});

	it("URL has no query string when request is undefined", () => {
		const { inspect } = createDeliveryPagedByUrlQuery({
			config: clientConfig,
			request: undefined,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(inspect().data?.url?.toString()).not.toContain("?");
	});

	it("URL has no query string when request has neither query nor filters", () => {
		const request: DeliveryRequest<never, never> = {};
		const { inspect } = createDeliveryPagedByUrlQuery({
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
		const { inspect } = createDeliveryPagedByUrlQuery({
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
		const { inspect } = createDeliveryPagedByUrlQuery({
			config: clientConfig,
			request,
			schema: paginationSchema,
			endpoint: "items",
		});
		expect(inspect().data?.url?.toString()).toContain(new URLSearchParams("system.type[eq]=movie").toString());
	});
});
