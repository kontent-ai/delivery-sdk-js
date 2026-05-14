import type { JsonValue } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import type { ZodMiniType } from "zod/mini";
import * as z from "zod/mini";
import type { DeliveryClientConfig, DeliveryClientSchema } from "../../../lib/models/core.models.js";
import type { Filter } from "../../../lib/models/filter.models.js";
import type { DeliveryRequest } from "../../../lib/models/request.models.js";
import { createDeliveryFetchQuery } from "../../../lib/queries/delivery-queries.js";
import { getDeliveryUrl } from "../../../lib/utils/url.utils.js";
import { isFetchQueryWithExpectedFunctions, unitEnvironmentId } from "../../utils/test.utils.js";

const clientConfig: DeliveryClientConfig<DeliveryClientSchema> = {
	apiMode: "public",
	environmentId: unitEnvironmentId,
};

const testSchema: () => Promise<ZodMiniType<JsonValue>> = async () => z.object({});

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

	it("resolves to the delivery URL for the configured endpoint", () => {
		const endpoint = "items/my_item";
		const { inspect } = createDeliveryFetchQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint,
		});
		expect(inspect().data?.url?.toString()).toEqual(new URL(getDeliveryUrl({ ...clientConfig, path: endpoint })).toString());
	});

	it("has no query string when request is undefined", () => {
		const { inspect } = createDeliveryFetchQuery({
			config: clientConfig,
			request: undefined,
			schema: testSchema,
			endpoint: "items/my_item",
		});
		expect(inspect().data?.url?.toString()).not.toContain("?");
	});

	it("has no query string when request has neither query nor filters", () => {
		const { inspect } = createDeliveryFetchQuery({
			config: clientConfig,
			request: {},
			schema: testSchema,
			endpoint: "items/my_item",
		});
		expect(inspect().data?.url?.toString()).not.toContain("?");
	});

	it("includes query parameters when request.query is provided", () => {
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

	it("includes filters when request.filters is provided", () => {
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
