import type { ErrorReason, JsonValue } from "@kontent-ai/core-sdk";
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, test } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import type { DeliveryClientSchema } from "../../../lib/models/core.models.js";
import type { PaginationPayload } from "../../../lib/public_api.js";
import {
	fetchContentItemSchema,
	fetchContentItemSchemaExtended,
	listContentItemsSchemaExtended,
} from "../../../lib/queries/content-items/schemas/content-item.schemas.js";
import type { ListLanguagesPayload } from "../../../lib/queries/languages/models/language.models.js";
import { listLanguagesSchema } from "../../../lib/queries/languages/schemas/language.schemas.js";
import { getFakeUuid, unitEnvironmentId } from "../../utils/test.utils.js";

describe("Response validation", () => {
	describe("Codename narrowing", () => {
		type TestSchema = DeliveryClientSchema<{
			readonly languageCodenames: readonly ["en-US", "cs-CZ", "de-DE"];
			readonly taxonomies: Record<string, never>;
			readonly contentTypes: Record<string, never>;
			readonly collectionCodenames: readonly [];
			readonly workflowCodenames: readonly [];
			readonly workflowStepCodenames: readonly [];
		}>;

		const mockPayload: ListLanguagesPayload<TestSchema> = {
			languages: [
				{
					system: {
						id: getFakeUuid(),
						codename: "de-DE",
						name: "German",
					},
				},
			],
			pagination: {
				skip: 0,
				limit: 0,
				count: 1,
				next_page: "",
			},
		};

		type NarrowSchema = DeliveryClientSchema<{
			readonly languageCodenames: readonly ["en-US", "cs-CZ"];
			readonly taxonomies: Record<string, never>;
			readonly contentTypes: Record<string, never>;
			readonly collectionCodenames: readonly [];
			readonly workflowCodenames: readonly [];
			readonly workflowStepCodenames: readonly [];
		}>;

		test("succeeds when the response contains a codename outside the defined schema (type-only narrowing)", async () => {
			const client = createDeliveryClient<NarrowSchema>({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client
				.listLanguages({ config: { schema: listLanguagesSchema<NarrowSchema>() } })
				.fetchPageSafe();

			expect(error).toBeUndefined();
			expect(success).toBeTruthy();
		});

		test("succeeds when the response contains only codenames within the defined schema", async () => {
			const client = createDeliveryClient<TestSchema>({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client
				.listLanguages({ config: { schema: listLanguagesSchema<TestSchema>() } })
				.fetchPageSafe();

			expect(error).toBeUndefined();
			expect(success).toBeTruthy();
		});

		test("succeeds when the schema has no codename constraints", async () => {
			const client = createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client.listLanguages({ config: { schema: listLanguagesSchema() } }).fetchPageSafe();

			expect(error).toBeUndefined();
			expect(success).toBeTruthy();
		});
	});

	describe("Extra properties", () => {
		const mockPayload: ListLanguagesPayload<DeliveryClientSchema> & { readonly extraProperty: string } = {
			languages: [
				{
					system: {
						id: getFakeUuid(),
						codename: "de-DE",
						name: "German",
						extraSystemProperty: "extra",
					} as ListLanguagesPayload<DeliveryClientSchema>["languages"][0]["system"] & { readonly extraSystemProperty: string },
				},
			],
			extraProperty: "extra",
			pagination: {
				skip: 0,
				limit: 0,
				count: 1,
				next_page: "",
				extraPaginationProperty: "extra",
			} as PaginationPayload["pagination"] & { readonly extraPaginationProperty: string },
		};

		test("succeeds when the response includes unrecognised properties", async () => {
			const client = createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client.listLanguages({ config: { schema: listLanguagesSchema() } }).fetchPageSafe();

			expect(error).toBeUndefined();
			expect(success).toBeTruthy();
		});
	});

	describe("Missing required properties", () => {
		const mockPayload: Omit<ListLanguagesPayload<DeliveryClientSchema>, "pagination"> = {
			languages: [
				{
					system: {
						id: getFakeUuid(),
						codename: "de-DE",
						name: "German",
					},
				},
			],
		};

		test("fails when the response is missing a required property", async () => {
			const client = createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client.listLanguages({ config: { schema: listLanguagesSchema() } }).fetchPageSafe();

			expect(error).toBeDefined();
			expect(success).toBeFalsy();
			expect(error?.details.reason).toBe<ErrorReason>("schemaMismatch");
		});

		test("does not validate when no schema is provided", async () => {
			const client = createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error, response } = await client.listLanguages().fetchPageSafe();

			expect(error).toBeUndefined();
			expect(success).toBe(true);
			expect(response?.payload).toStrictEqual(mockPayload);
		});
	});

	describe("Circular linked items", () => {
		const createItem = (codename: string, linkedCodenames: readonly string[]) => ({
			system: {
				id: getFakeUuid(),
				name: codename,
				codename,
				language: "default",
				type: "movie",
				collection: "default",
				last_modified: "2026-05-04T10:30:48.5100633Z",
				workflow: "default",
				workflow_step: "published",
				sitemap_locations: [],
			},
			elements: {
				related: {
					type: "modular_content",
					name: "Related",
					value: linkedCodenames,
				},
			},
		});

		const createClient = (jsonResponse: JsonValue) =>
			createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse,
					statusCode: 200,
				}),
			});

		test("fetchContentItem succeeds when items reference each other", async () => {
			const client = createClient({
				item: createItem("a", ["b"]),
				modular_content: { b: createItem("b", ["a"]) },
			});

			const { success, error, response } = await client
				.fetchContentItem({ codename: "a", config: { schema: fetchContentItemSchemaExtended() } })
				.fetchSafe();

			expect(error).toBeUndefined();
			expect(success).toBe(true);
			expect(
				response?.payload.item.elements.related?.type === "modular_content" &&
					response.payload.item.elements.related.items[0]?.system.codename,
			).toBe("b");
		});

		test("fetchContentItem succeeds when an item references itself", async () => {
			const client = createClient({
				item: createItem("a", ["a"]),
				modular_content: {},
			});

			const { success, error } = await client
				.fetchContentItem({ codename: "a", config: { schema: fetchContentItemSchemaExtended() } })
				.fetchSafe();

			expect(error).toBeUndefined();
			expect(success).toBe(true);
		});

		test("raw query validates the raw payload with the schema passed to raw()", async () => {
			const client = createClient({
				item: createItem("a", ["b"]),
				modular_content: { b: createItem("b", ["a"]) },
			});

			const { success, error } = await client
				.fetchContentItem({ codename: "a" })
				.raw({ schema: fetchContentItemSchema() })
				.fetchSafe();

			expect(error).toBeUndefined();
			expect(success).toBe(true);
		});

		test("raw query fails validation when the raw payload does not match the schema", async () => {
			const client = createClient({ item: createItem("a", []) });

			const { success, error } = await client
				.fetchContentItem({ codename: "a" })
				.raw({ schema: fetchContentItemSchema() })
				.fetchSafe();

			expect(success).toBe(false);
			expect(error?.details.reason).toBe<ErrorReason>("schemaMismatch");
		});

		test("listContentItems succeeds when items reference each other", async () => {
			const client = createClient({
				items: [createItem("a", ["b"]), createItem("b", ["a"])],
				modular_content: {},
				pagination: { skip: 0, limit: 0, count: 2, next_page: "" },
			});

			const { success, error } = await client
				.listContentItems({ config: { schema: listContentItemsSchemaExtended() } })
				.fetchPageSafe();

			expect(error).toBeUndefined();
			expect(success).toBe(true);
		});
	});

	describe("Error details", () => {
		test("populates url, issues and payload on a parsing failure", async ({ expect }) => {
			const query = createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: {
						result: "invalidValue",
					},
					statusCode: 200,
				}),
			}).listLanguages({ config: { schema: listLanguagesSchema() } });

			const { success, error } = await query.fetchPageSafe();

			expect(success).toBe(false);
			expect(error).toBeDefined();
			expect(error?.details.reason).toStrictEqual<ErrorReason>("schemaMismatch");

			if (error?.details.reason === "schemaMismatch") {
				expect(error.details.url).toStrictEqual(query.inspect().data?.url);
				expect(error.details.issues.length).toBeGreaterThan(0);
				expect(error.details.payload).toBeDefined();
			} else {
				throw new Error(`Unexpected error reason '${error?.details.reason}'`);
			}
		});
	});
});
