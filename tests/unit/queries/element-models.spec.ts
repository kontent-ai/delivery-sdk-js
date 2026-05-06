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

describe("elementDef.number", () => {
	test("accepts null when isRequired is omitted", () => {
		const schema = elementDef.number();
		expect(schema.safeParse({ type: "number", name: "Rating", value: null }).success).toBe(true);
		expect(schema.safeParse({ type: "number", name: "Rating", value: 5 }).success).toBe(true);
	});

	test("rejects null when isRequired is true", () => {
		const schema = elementDef.number({ isRequired: true });
		expect(schema.safeParse({ type: "number", name: "Rating", value: null }).success).toBe(false);
		expect(schema.safeParse({ type: "number", name: "Rating", value: 5 }).success).toBe(true);
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

describe("elementDef.dateTime", () => {
	test("accepts null value when isRequired is omitted", () => {
		const schema = elementDef.dateTime();
		expect(schema.safeParse({ type: "date_time", name: "Release", value: null, display_timezone: null }).success).toBe(true);
		expect(
			schema.safeParse({ type: "date_time", name: "Release", value: "2024-01-01T00:00:00.000Z", display_timezone: null }).success,
		).toBe(true);
	});

	test("rejects null value when isRequired is true", () => {
		const schema = elementDef.dateTime({ isRequired: true });
		expect(schema.safeParse({ type: "date_time", name: "Release", value: null, display_timezone: null }).success).toBe(false);
		expect(
			schema.safeParse({ type: "date_time", name: "Release", value: "2024-01-01T00:00:00.000Z", display_timezone: null }).success,
		).toBe(true);
	});
});

describe("elementDef.richText", () => {
	const makePayload = () => ({
		type: "rich_text",
		name: "Body",
		value: "<p>hello</p>",
		images: {
			img1: {
				image_id: "img1",
				description: null,
				url: "https://example.com/img.jpg",
				width: 100,
				height: 80,
			},
		},
		links: {
			link1: {
				codename: "linked_item",
				type: "actor",
				url_slug: "linked-item",
			},
		},
		modular_content: ["linked_item"],
	});

	test("validates a complete rich text payload", () => {
		const schema = elementDef.richText();
		expect(schema.safeParse(makePayload()).success).toBe(true);
	});

	test("accepts empty images, links and modular_content", () => {
		const schema = elementDef.richText();
		expect(
			schema.safeParse({
				type: "rich_text",
				name: "Body",
				value: "",
				images: {},
				links: {},
				modular_content: [],
			}).success,
		).toBe(true);
	});

	test("rejects payload with wrong discriminator type", () => {
		const schema = elementDef.richText();
		expect(schema.safeParse({ ...makePayload(), type: "text" }).success).toBe(false);
	});

	test("rejects payload missing required fields", () => {
		const schema = elementDef.richText();
		const { images: _images, ...withoutImages } = makePayload();
		expect(schema.safeParse(withoutImages).success).toBe(false);
	});
});

describe("elementDef.urlSlug", () => {
	test("accepts empty string when isRequired is omitted", () => {
		const schema = elementDef.urlSlug();
		expect(schema.safeParse({ type: "url_slug", name: "Slug", value: "" }).success).toBe(true);
		expect(schema.safeParse({ type: "url_slug", name: "Slug", value: "my-slug" }).success).toBe(true);
	});

	test("rejects empty string when isRequired is true", () => {
		const schema = elementDef.urlSlug({ isRequired: true });
		expect(schema.safeParse({ type: "url_slug", name: "Slug", value: "" }).success).toBe(false);
		expect(schema.safeParse({ type: "url_slug", name: "Slug", value: "my-slug" }).success).toBe(true);
	});
});

describe("elementDef.custom", () => {
	test("accepts null value when isRequired is omitted", () => {
		const schema = elementDef.custom();
		expect(schema.safeParse({ type: "custom", name: "ID", value: null }).success).toBe(true);
		expect(schema.safeParse({ type: "custom", name: "ID", value: "abc" }).success).toBe(true);
	});

	test("rejects null value when isRequired is true", () => {
		const schema = elementDef.custom({ isRequired: true });
		expect(schema.safeParse({ type: "custom", name: "ID", value: null }).success).toBe(false);
		expect(schema.safeParse({ type: "custom", name: "ID", value: "abc" }).success).toBe(true);
	});
});

describe("elementDef.asset", () => {
	const makeAsset = () => ({
		name: "poster.jpg",
		description: null,
		type: "image/jpeg",
		size: 1024,
		url: "https://example.com/poster.jpg",
		width: 800,
		height: 600,
		renditions: {},
	});

	test("accepts empty value array when isRequired is omitted", () => {
		const schema = elementDef.asset();
		expect(schema.safeParse({ type: "asset", name: "Poster", value: [] }).success).toBe(true);
		expect(schema.safeParse({ type: "asset", name: "Poster", value: [makeAsset()] }).success).toBe(true);
	});

	test("rejects empty value array when isRequired is true", () => {
		const schema = elementDef.asset({ isRequired: true });
		expect(schema.safeParse({ type: "asset", name: "Poster", value: [] }).success).toBe(false);
		expect(schema.safeParse({ type: "asset", name: "Poster", value: [makeAsset()] }).success).toBe(true);
	});
});

describe("elementDef.multipleChoice", () => {
	test("validates options without codename constraint when codenames omitted", () => {
		const schema = elementDef.multipleChoice();
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Lead", codename: "lead" }] }).success).toBe(true);
	});

	test("rejects unknown codename when codenames provided", () => {
		const schema = elementDef.multipleChoice({ codenames: ["lead", "supporting"] as const });
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Extra", codename: "extra" }] }).success).toBe(
			false,
		);
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Lead", codename: "lead" }] }).success).toBe(true);
	});

	test("accepts empty value array when isRequired is omitted", () => {
		const schema = elementDef.multipleChoice();
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [] }).success).toBe(true);
	});

	test("rejects empty value array when isRequired is true", () => {
		const schema = elementDef.multipleChoice({ isRequired: true });
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [] }).success).toBe(false);
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Lead", codename: "lead" }] }).success).toBe(true);
	});
});

describe("elementDef.taxonomy", () => {
	test("validates terms without codename constraint when codenames omitted", () => {
		const schema = elementDef.taxonomy();
		expect(
			schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [{ name: "Action", codename: "action" }] })
				.success,
		).toBe(true);
	});

	test("rejects unknown codename when codenames provided", () => {
		const schema = elementDef.taxonomy({ codenames: ["action", "drama"] as const });
		expect(
			schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [{ name: "Comedy", codename: "comedy" }] })
				.success,
		).toBe(false);
		expect(
			schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [{ name: "Action", codename: "action" }] })
				.success,
		).toBe(true);
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

	test("accepts empty value and items arrays when isRequired is omitted", () => {
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
		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: [], items: [] }).success).toBe(true);
	});

	test("rejects empty value or items arrays when isRequired is true", () => {
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
		const schema = elementDef.linkedItems([actorSchema, movieSchema], { isRequired: true });
		const system = makeSystem();

		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: [], items: [] }).success).toBe(false);
		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: ["x"], items: [] }).success).toBe(false);
		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: [], items: [{ system, elements: {} }] }).success).toBe(
			false,
		);
		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: ["x"], items: [{ system, elements: {} }] }).success).toBe(
			true,
		);
	});

	const buildLinkedItemsSchemas = () => {
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
		const item = { system: makeSystem(), elements: {} };
		const make = (count: number) => ({
			type: "modular_content" as const,
			name: "Cast",
			value: Array.from({ length: count }, (_, i) => `x${i}`),
			items: Array.from({ length: count }, () => item),
		});
		return { actorSchema, movieSchema, make };
	};

	test("limitType atLeast enforces minimum count on value and items", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.linkedItems([actorSchema, movieSchema], { limitType: "atLeast", itemsLimit: 2 });

		expect(schema.safeParse(make(1)).success).toBe(false);
		expect(schema.safeParse(make(2)).success).toBe(true);
		expect(schema.safeParse(make(3)).success).toBe(true);
	});

	test("limitType atMost enforces maximum count on value and items", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.linkedItems([actorSchema, movieSchema], { limitType: "atMost", itemsLimit: 2 });

		expect(schema.safeParse(make(0)).success).toBe(true);
		expect(schema.safeParse(make(2)).success).toBe(true);
		expect(schema.safeParse(make(3)).success).toBe(false);
	});

	test("limitType exactly enforces precise count on value and items", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.linkedItems([actorSchema, movieSchema], { limitType: "exactly", itemsLimit: 2 });

		expect(schema.safeParse(make(1)).success).toBe(false);
		expect(schema.safeParse(make(2)).success).toBe(true);
		expect(schema.safeParse(make(3)).success).toBe(false);
	});

	test("isRequired composes with limitType atMost", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.linkedItems([actorSchema, movieSchema], {
			isRequired: true,
			limitType: "atMost",
			itemsLimit: 2,
		});

		expect(schema.safeParse(make(0)).success).toBe(false);
		expect(schema.safeParse(make(1)).success).toBe(true);
		expect(schema.safeParse(make(2)).success).toBe(true);
		expect(schema.safeParse(make(3)).success).toBe(false);
	});

	test("itemsLimit without limitType is ignored", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.linkedItems([actorSchema, movieSchema], { itemsLimit: 2 });

		expect(schema.safeParse(make(0)).success).toBe(true);
		expect(schema.safeParse(make(5)).success).toBe(true);
	});

	test("limitType without itemsLimit is ignored", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.linkedItems([actorSchema, movieSchema], { limitType: "exactly" });

		expect(schema.safeParse(make(0)).success).toBe(true);
		expect(schema.safeParse(make(5)).success).toBe(true);
	});
});
