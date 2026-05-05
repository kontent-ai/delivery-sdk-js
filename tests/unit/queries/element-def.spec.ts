import { describe, expect, test } from "vitest";
import z from "zod";
import type { ContentItemSystemPayload, DeliveryClientSchema } from "../../../lib/public_api.js";
import { narrowedContentItemSystemSchema } from "../../../lib/queries/content-items/content-item.models.js";
import { elementDef } from "../../../lib/queries/content-items/element.models.js";
import { getFakeUuid } from "../../utils/test.utils.js";

const schemaInput = {
	languageCodenames: ["en"],
	contentTypeCodenames: ["actor", "movie"],
	taxonomyCodenames: [],
	elementCodenames: [],
	collectionCodenames: ["default"],
	workflowCodenames: ["published"],
	workflowStepCodenames: ["published"],
} as const satisfies DeliveryClientSchema;

const makeSystem = (): ContentItemSystemPayload<typeof schemaInput> => ({
	id: getFakeUuid(),
	name: "Test Item",
	codename: "x",
	language: "en",
	type: "actor",
	collection: "default",
	last_modified: "2024-01-01T00:00:00.000Z",
	workflow: "published",
	workflow_step: "published",
	sitemap_locations: [],
});

describe("elementDef.linkedItems", () => {
	test("items are validated against the union when multiple schemas provided", () => {
		const actorSchema = z
			.object({
				system: narrowedContentItemSystemSchema(schemaInput, "actor"),
				elements: z.record(z.string(), z.unknown()),
			})
			.readonly();
		const movieSchema = z
			.object({
				system: narrowedContentItemSystemSchema(schemaInput, "movie"),
				elements: z.record(z.string(), z.unknown()),
			})
			.readonly();
		const schema = elementDef.linkedItems([actorSchema, movieSchema]);
		const system = makeSystem();

		const validActor = schema.safeParse({
			type: "modular_content",
			name: "Cast",
			value: [],
			items: [{ system, elements: {} }],
		});
		const validMovie = schema.safeParse({
			type: "modular_content",
			name: "Cast",
			value: [],
			items: [{ system: { ...system, type: "movie", codename: "movie" }, elements: {} }],
		});
		const invalid = schema.safeParse({
			type: "modular_content",
			name: "Cast",
			value: [],
			items: [{ noSystemOrElements: true }],
		});

		expect(validActor.success).toBe(true);
		expect(validMovie.success).toBe(true);
		expect(invalid.success).toBe(false);
	});
});
