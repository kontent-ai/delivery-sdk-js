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
			title: elementDef.optional.text(),
		});
		expect(
			schema.safeParse({
				system: makeSystem(),
				elements: { title: { type: "text", name: "Title", value: "Hello" } },
			}).success,
		).toBe(true);
	});
});

describe("elementDef.optional.number", () => {
	test("accepts null and a number", () => {
		const schema = elementDef.optional.number();
		expect(schema.safeParse({ type: "number", name: "Rating", value: null }).success).toBe(true);
		expect(schema.safeParse({ type: "number", name: "Rating", value: 5 }).success).toBe(true);
	});
});

describe("elementDef.required.number", () => {
	test("rejects null", () => {
		const schema = elementDef.required.number();
		expect(schema.safeParse({ type: "number", name: "Rating", value: null }).success).toBe(false);
		expect(schema.safeParse({ type: "number", name: "Rating", value: 5 }).success).toBe(true);
	});
});

describe("elementDef.optional.text", () => {
	test("accepts any string when maxLength is omitted", () => {
		const schema = elementDef.optional.text();
		expect(schema.safeParse({ type: "text", name: "Title", value: "" }).success).toBe(true);
		expect(schema.safeParse({ type: "text", name: "Title", value: "a".repeat(1000) }).success).toBe(true);
	});

	test("rejects value exceeding maxLength", () => {
		const schema = elementDef.optional.text({ maxLength: 5 });
		expect(schema.safeParse({ type: "text", name: "Title", value: "toolong" }).success).toBe(false);
		expect(schema.safeParse({ type: "text", name: "Title", value: "ok" }).success).toBe(true);
	});
});

describe("elementDef.required.text", () => {
	test("rejects empty string", () => {
		const schema = elementDef.required.text();
		expect(schema.safeParse({ type: "text", name: "Title", value: "" }).success).toBe(false);
		expect(schema.safeParse({ type: "text", name: "Title", value: "x" }).success).toBe(true);
	});

	test("composes min(1) with maxLength", () => {
		const schema = elementDef.required.text({ maxLength: 5 });
		expect(schema.safeParse({ type: "text", name: "Title", value: "" }).success).toBe(false);
		expect(schema.safeParse({ type: "text", name: "Title", value: "toolong" }).success).toBe(false);
		expect(schema.safeParse({ type: "text", name: "Title", value: "ok" }).success).toBe(true);
	});
});

describe("elementDef.optional.dateTime", () => {
	test("accepts null", () => {
		const schema = elementDef.optional.dateTime();
		expect(schema.safeParse({ type: "date_time", name: "Release", value: null, display_timezone: null }).success).toBe(true);
		expect(
			schema.safeParse({ type: "date_time", name: "Release", value: "2024-01-01T00:00:00.000Z", display_timezone: null }).success,
		).toBe(true);
	});
});

describe("elementDef.required.dateTime", () => {
	test("rejects null", () => {
		const schema = elementDef.required.dateTime();
		expect(schema.safeParse({ type: "date_time", name: "Release", value: null, display_timezone: null }).success).toBe(false);
		expect(
			schema.safeParse({ type: "date_time", name: "Release", value: "2024-01-01T00:00:00.000Z", display_timezone: null }).success,
		).toBe(true);
	});
});

describe("elementDef.optional.richText / elementDef.required.richText", () => {
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

	test("optional validates a complete rich text payload", () => {
		expect(elementDef.optional.richText().safeParse(makePayload()).success).toBe(true);
	});

	test("required validates a complete rich text payload", () => {
		expect(elementDef.required.richText().safeParse(makePayload()).success).toBe(true);
	});

	test("accepts empty images, links and modular_content", () => {
		const empty = { type: "rich_text", name: "Body", value: "", images: {}, links: {}, modular_content: [] };
		expect(elementDef.optional.richText().safeParse(empty).success).toBe(true);
		expect(elementDef.required.richText().safeParse(empty).success).toBe(true);
	});

	test("rejects payload with wrong discriminator type", () => {
		expect(elementDef.optional.richText().safeParse({ ...makePayload(), type: "text" }).success).toBe(false);
	});

	test("rejects payload missing required fields", () => {
		const { images: _images, ...withoutImages } = makePayload();
		expect(elementDef.optional.richText().safeParse(withoutImages).success).toBe(false);
	});
});

describe("elementDef.optional.urlSlug", () => {
	test("accepts empty string", () => {
		const schema = elementDef.optional.urlSlug();
		expect(schema.safeParse({ type: "url_slug", name: "Slug", value: "" }).success).toBe(true);
		expect(schema.safeParse({ type: "url_slug", name: "Slug", value: "my-slug" }).success).toBe(true);
	});
});

describe("elementDef.required.urlSlug", () => {
	test("rejects empty string", () => {
		const schema = elementDef.required.urlSlug();
		expect(schema.safeParse({ type: "url_slug", name: "Slug", value: "" }).success).toBe(false);
		expect(schema.safeParse({ type: "url_slug", name: "Slug", value: "my-slug" }).success).toBe(true);
	});
});

describe("elementDef.optional.custom", () => {
	test("accepts null", () => {
		const schema = elementDef.optional.custom();
		expect(schema.safeParse({ type: "custom", name: "ID", value: null }).success).toBe(true);
		expect(schema.safeParse({ type: "custom", name: "ID", value: "abc" }).success).toBe(true);
	});
});

describe("elementDef.required.custom", () => {
	test("rejects null", () => {
		const schema = elementDef.required.custom();
		expect(schema.safeParse({ type: "custom", name: "ID", value: null }).success).toBe(false);
		expect(schema.safeParse({ type: "custom", name: "ID", value: "abc" }).success).toBe(true);
	});
});

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

describe("elementDef.optional.asset", () => {
	test("accepts empty value array", () => {
		const schema = elementDef.optional.asset();
		expect(schema.safeParse({ type: "asset", name: "Poster", value: [] }).success).toBe(true);
		expect(schema.safeParse({ type: "asset", name: "Poster", value: [makeAsset()] }).success).toBe(true);
	});
});

describe("elementDef.required.asset", () => {
	test("rejects empty value array", () => {
		const schema = elementDef.required.asset();
		expect(schema.safeParse({ type: "asset", name: "Poster", value: [] }).success).toBe(false);
		expect(schema.safeParse({ type: "asset", name: "Poster", value: [makeAsset()] }).success).toBe(true);
	});
});

describe("elementDef.optional.multipleChoice", () => {
	test("accepts empty value array and validates option codename when codenames omitted", () => {
		const schema = elementDef.optional.multipleChoice();
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [] }).success).toBe(true);
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Lead", codename: "lead" }] }).success).toBe(true);
	});

	test("accepts any codename at runtime when codenames provided (type-only narrowing)", () => {
		const schema = elementDef.optional.multipleChoice({ codenames: ["lead", "supporting"] as const });
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Extra", codename: "extra" }] }).success).toBe(
			true,
		);
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Lead", codename: "lead" }] }).success).toBe(true);
	});
});

describe("elementDef.required.multipleChoice", () => {
	test("rejects empty value array", () => {
		const schema = elementDef.required.multipleChoice();
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [] }).success).toBe(false);
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Lead", codename: "lead" }] }).success).toBe(true);
	});

	test("accepts any codename at runtime when codenames provided (type-only narrowing)", () => {
		const schema = elementDef.required.multipleChoice({ codenames: ["lead", "supporting"] as const });
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Extra", codename: "extra" }] }).success).toBe(
			true,
		);
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Lead", codename: "lead" }] }).success).toBe(true);
	});
});

describe("elementDef.optional.taxonomy", () => {
	test("accepts empty value array and validates terms when codenames omitted", () => {
		const schema = elementDef.optional.taxonomy();
		expect(schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [] }).success).toBe(true);
		expect(
			schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [{ name: "Action", codename: "action" }] })
				.success,
		).toBe(true);
	});

	test("accepts any codename at runtime when codenames provided (type-only narrowing)", () => {
		const schema = elementDef.optional.taxonomy({ codenames: ["action", "drama"] as const });
		expect(
			schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [{ name: "Comedy", codename: "comedy" }] })
				.success,
		).toBe(true);
		expect(
			schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [{ name: "Action", codename: "action" }] })
				.success,
		).toBe(true);
	});
});

describe("elementDef.required.taxonomy", () => {
	test("rejects empty value array", () => {
		const schema = elementDef.required.taxonomy();
		expect(schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [] }).success).toBe(false);
		expect(
			schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [{ name: "Action", codename: "action" }] })
				.success,
		).toBe(true);
	});
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

describe("elementDef.optional.linkedItems", () => {
	test("items are validated against the union when multiple schemas provided", () => {
		const { actorSchema, movieSchema } = buildLinkedItemsSchemas();
		const schema = elementDef.optional.linkedItems([actorSchema, movieSchema]);
		const system = makeSystem();

		expect(
			schema.safeParse({
				type: "modular_content",
				name: "Cast",
				value: [],
				items: [{ system, elements: {} }],
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				type: "modular_content",
				name: "Cast",
				value: [],
				items: [{ system: { ...system, type: "movie", codename: "movie" }, elements: {} }],
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				type: "modular_content",
				name: "Cast",
				value: [],
				items: [{ noSystemOrElements: true }],
			}).success,
		).toBe(false);
	});

	test("accepts empty value and items arrays", () => {
		const { actorSchema, movieSchema } = buildLinkedItemsSchemas();
		const schema = elementDef.optional.linkedItems([actorSchema, movieSchema]);
		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: [], items: [] }).success).toBe(true);
	});

	test("limitType atLeast enforces minimum count", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.optional.linkedItems([actorSchema, movieSchema], { limitType: "atLeast", itemsLimit: 2 });

		expect(schema.safeParse(make(1)).success).toBe(false);
		expect(schema.safeParse(make(2)).success).toBe(true);
		expect(schema.safeParse(make(3)).success).toBe(true);
	});

	test("limitType atMost enforces maximum count", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.optional.linkedItems([actorSchema, movieSchema], { limitType: "atMost", itemsLimit: 2 });

		expect(schema.safeParse(make(0)).success).toBe(true);
		expect(schema.safeParse(make(2)).success).toBe(true);
		expect(schema.safeParse(make(3)).success).toBe(false);
	});

	test("limitType exactly enforces precise count", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.optional.linkedItems([actorSchema, movieSchema], { limitType: "exactly", itemsLimit: 2 });

		expect(schema.safeParse(make(1)).success).toBe(false);
		expect(schema.safeParse(make(2)).success).toBe(true);
		expect(schema.safeParse(make(3)).success).toBe(false);
	});

	test("itemsLimit without limitType is ignored", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.optional.linkedItems([actorSchema, movieSchema], { itemsLimit: 2 });

		expect(schema.safeParse(make(0)).success).toBe(true);
		expect(schema.safeParse(make(5)).success).toBe(true);
	});

	test("limitType without itemsLimit is ignored", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.optional.linkedItems([actorSchema, movieSchema], { limitType: "exactly" });

		expect(schema.safeParse(make(0)).success).toBe(true);
		expect(schema.safeParse(make(5)).success).toBe(true);
	});
});

describe("elementDef.required.linkedItems", () => {
	test("rejects empty value or items arrays", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.required.linkedItems([actorSchema, movieSchema]);
		const system = makeSystem();

		expect(schema.safeParse(make(0)).success).toBe(false);
		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: ["x"], items: [] }).success).toBe(false);
		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: [], items: [{ system, elements: {} }] }).success).toBe(
			false,
		);
		expect(schema.safeParse(make(1)).success).toBe(true);
	});

	test("composes implicit min(1) with limitType atMost", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.required.linkedItems([actorSchema, movieSchema], { limitType: "atMost", itemsLimit: 2 });

		expect(schema.safeParse(make(0)).success).toBe(false);
		expect(schema.safeParse(make(1)).success).toBe(true);
		expect(schema.safeParse(make(2)).success).toBe(true);
		expect(schema.safeParse(make(3)).success).toBe(false);
	});

	test("limitType atLeast already implies min(N)", () => {
		const { actorSchema, movieSchema, make } = buildLinkedItemsSchemas();
		const schema = elementDef.required.linkedItems([actorSchema, movieSchema], { limitType: "atLeast", itemsLimit: 3 });

		expect(schema.safeParse(make(2)).success).toBe(false);
		expect(schema.safeParse(make(3)).success).toBe(true);
	});
});
