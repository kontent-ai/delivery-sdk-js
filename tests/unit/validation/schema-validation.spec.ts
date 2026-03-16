import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, test } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import type { FullDeliveryClientSchema } from "../../../lib/models/core.models.js";
import type { ListLanguagesPayload } from "../../../lib/queries/languages/language.models.js";
import { getFakeUuid, unitEnvironmentId } from "../../utils/test.utils.js";

type PartialSchemaInput = {
	readonly languageCodenames?: readonly string[];
	readonly taxonomyCodenames?: readonly string[];
	readonly contentTypeCodenames?: readonly string[];
};

type InferFullSchema<T extends PartialSchemaInput> = {
	readonly languageCodenames: T["languageCodenames"] extends readonly string[] ? T["languageCodenames"] : readonly string[];
	readonly taxonomyCodenames: T["taxonomyCodenames"] extends readonly string[] ? T["taxonomyCodenames"] : readonly string[];
	readonly contentTypeCodenames: T["contentTypeCodenames"] extends readonly string[] ? T["contentTypeCodenames"] : readonly string[];
};

function createPartialShema<const T extends PartialSchemaInput>(schema: T): InferFullSchema<T> {
	return {
		languageCodenames: schema.languageCodenames ?? [],
		taxonomyCodenames: schema.taxonomyCodenames ?? [],
		contentTypeCodenames: schema.contentTypeCodenames ?? [],
	};
}

const fe = createPartialShema({
	contentTypeCodenames: ["f"],
});

const clientfefe = createDeliveryClient({
	apiMode: "public",
	environmentId: unitEnvironmentId,
	schema: { languageCodenames: ["en-US", "cs-CZ"] },
});
void fe;
void clientfefe;
const bbb = await clientfefe.listLanguages().fetchPage();
const ccc = await clientfefe.listTaxonomies().fetchPage();
bbb.payload.languages[0]?.system.codename === "cs-CZ2";
const fgggge = ccc.payload.taxonomies[0]?.system.codename === "fefefe";
const hzthzhz = ccc.payload.taxonomies[0]?.system.codename;

describe("Schema validation", () => {
	type TestDeliveryClientTypes = FullDeliveryClientSchema<{
		readonly languageCodenames: readonly ["en-US", "cs-CZ", "de-DE"];
		readonly taxonomyCodenames: readonly [];
		readonly contentTypeCodenames: readonly [];
	}>;

	const mockPayload: ListLanguagesPayload<TestDeliveryClientTypes> = {
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

	test("Response should NOT be successful when response does not match defined language codenames schema", async () => {
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: { languageCodenames: ["en-US", "cs-CZ"], taxonomyCodenames: [] },
			httpService: getTestHttpServiceWithJsonResponse({
				jsonResponse: mockPayload,
				statusCode: 200,
			}),
			responseValidation: {
				enable: true,
			},
		});

		const { success, error } = await client.listLanguages().fetchPageSafe();

		expect(error).toBeDefined();
		expect(success).toBeFalsy();
		expect(error?.details.reason).toBe("validationFailed");
	});

	test("Response should be successful when response matches defines language codenames schema", async () => {
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: { languageCodenames: ["en-US", "cs-CZ", "de-DE"], taxonomyCodenames: [] },
			httpService: getTestHttpServiceWithJsonResponse({
				jsonResponse: mockPayload,
				statusCode: 200,
			}),
		});

		const { success, error } = await client.listLanguages().fetchPageSafe();

		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});

	test("Response should be successful when response matches general string codename schema", async () => {
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: { languageCodenames: [], taxonomyCodenames: [] },
			httpService: getTestHttpServiceWithJsonResponse({
				jsonResponse: mockPayload,
				statusCode: 200,
			}),
		});

		const { success, error } = await client.listLanguages().fetchPageSafe();

		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});

	test("Response should be successful when an empty array is provided as codenames source", async () => {
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: { languageCodenames: [], taxonomyCodenames: [] },
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
