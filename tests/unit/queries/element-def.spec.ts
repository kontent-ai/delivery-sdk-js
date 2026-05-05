import { describe, expect, test } from "vitest";
import z from "zod";
import type { ContentItemSystemPayload, DeliveryClientSchema } from "../../../lib/public_api.js";
import { contentItemSystemWithCodename, defineContentItem } from "../../../lib/queries/content-items/content-item.models.js";
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

describe("defineContentItem", () => {
	test("builds a schema that validates a matching content item", () => {
		const schema = defineContentItem(schemaInput, "actor", {
			title: elementDef.text(),
		});
		expect(
			schema.safeParse({
				system: makeSystem(),
				elements: { title: { type: "text", name: "Title", value: "Hello" } },
			}).success,
		).toBe(true);
	});
});

describe("elementDef.text", () => {
	test("validates value without constraint when maxLength is omitted", () => {
		const schema = elementDef.text();
		expect(schema.safeParse({ type: "text", name: "Title", value: "a".repeat(1000) }).success).toBe(true);
	});

	test("rejects value exceeding maxLength", () => {
		const schema = elementDef.text({ maxLength: 5 });
		expect(schema.safeParse({ type: "text", name: "Title", value: "toolong" }).success).toBe(false);
		expect(schema.safeParse({ type: "text", name: "Title", value: "ok" }).success).toBe(true);
	});

	test("rejects empty string when isRequired is true", () => {
		const schema = elementDef.text({ isRequired: true });
		expect(schema.safeParse({ type: "text", name: "Title", value: "" }).success).toBe(false);
		expect(schema.safeParse({ type: "text", name: "Title", value: "x" }).success).toBe(true);
	});

	test("applies both isRequired and maxLength together", () => {
		const schema = elementDef.text({ isRequired: true, maxLength: 5 });
		expect(schema.safeParse({ type: "text", name: "Title", value: "" }).success).toBe(false);
		expect(schema.safeParse({ type: "text", name: "Title", value: "toolong" }).success).toBe(false);
		expect(schema.safeParse({ type: "text", name: "Title", value: "ok" }).success).toBe(true);
	});
});

describe("elementDef.linkedItems", () => {
	test("items are validated against the union when multiple schemas provided", () => {
		const actorSchema = z
			.object({
				system: contentItemSystemWithCodename(schemaInput, "actor"),
				elements: z.record(z.string(), z.unknown()),
			})
			.readonly();
		const movieSchema = z
			.object({
				system: contentItemSystemWithCodename(schemaInput, "movie"),
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
