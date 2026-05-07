import type { ErrorReason } from "@kontent-ai/core-sdk";
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, test } from "vitest";
import { ZodError } from "zod";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import type { DeliveryClientSchema } from "../../../lib/models/core.models.js";
import type { PaginationPayload } from "../../../lib/public_api.js";
import type { ListLanguagesPayload } from "../../../lib/queries/languages/language.models.js";
import { getFakeUuid, unitEnvironmentId } from "../../utils/test.utils.js";

const baseSchema = {
	languageCodenames: [],
	taxonomyCodenames: [],
	contentTypeCodenames: [],
	elementCodenames: [],
	collectionCodenames: [],
	workflowCodenames: [],
	workflowStepCodenames: [],
} as const satisfies DeliveryClientSchema;

describe("Response validation", () => {
	describe("Codename narrowing", () => {
		type TestSchema = DeliveryClientSchema<{
			readonly languageCodenames: readonly ["en-US", "cs-CZ", "de-DE"];
			readonly taxonomyCodenames: readonly [];
			readonly contentTypeCodenames: readonly [];
			readonly elementCodenames: readonly [];
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

		test("succeeds when the response contains a codename outside the defined schema (type-only narrowing)", async () => {
			const client = createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				schema: {
					languageCodenames: ["en-US", "cs-CZ"],
					taxonomyCodenames: [],
					contentTypeCodenames: [],
					elementCodenames: [],
					collectionCodenames: [],
					workflowCodenames: [],
					workflowStepCodenames: [],
				},
				runtimeValidation: {
					validateResponses: true,
				},
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client.listLanguages().fetchPageSafe();

			expect(error).toBeUndefined();
			expect(success).toBeTruthy();
		});

		test("succeeds when the response contains only codenames within the defined schema", async () => {
			const client = createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				schema: {
					languageCodenames: ["en-US", "cs-CZ", "de-DE"],
					taxonomyCodenames: [],
					contentTypeCodenames: [],
					elementCodenames: [],
					collectionCodenames: [],
					workflowCodenames: [],
					workflowStepCodenames: [],
				},
				runtimeValidation: {
					validateResponses: true,
				},
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client.listLanguages().fetchPageSafe();

			expect(error).toBeUndefined();
			expect(success).toBeTruthy();
		});

		test("succeeds when the schema has no codename constraints", async () => {
			const client = createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				schema: baseSchema,
				runtimeValidation: {
					validateResponses: true,
				},
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client.listLanguages().fetchPageSafe();

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
				schema: baseSchema,
				runtimeValidation: {
					validateResponses: true,
				},
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client.listLanguages().fetchPageSafe();

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
				schema: baseSchema,
				runtimeValidation: {
					validateResponses: true,
				},
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

			const { success, error } = await client.listLanguages().fetchPageSafe();

			expect(error).toBeDefined();
			expect(success).toBeFalsy();
			expect(error?.details.reason).toBe<ErrorReason>("parsingFailed");
		});
	});

	describe("Error details", () => {
		test("populates url, zodError and response on a parsing failure", async ({ expect }) => {
			const query = createDeliveryClient({
				apiMode: "public",
				environmentId: unitEnvironmentId,
				schema: baseSchema,
				runtimeValidation: {
					validateResponses: true,
				},
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: {
						result: "invalidValue",
					},
					statusCode: 200,
				}),
			}).listLanguages();

			const { success, error } = await query.fetchPageSafe();

			expect(success).toBe(false);
			expect(error).toBeDefined();
			expect(error?.details.reason).toStrictEqual<ErrorReason>("parsingFailed");

			if (error?.details.reason === "parsingFailed") {
				expect(error.details.url).toStrictEqual(query.inspect().data?.url);
				expect(error.details.zodError).toBeInstanceOf(ZodError);
				expect(error.details.response).toBeDefined();
			} else {
				throw new Error(`Unexpected error reason '${error?.details.reason}'`);
			}
		});
	});
});
