import { describe, expect, test } from "vitest";
import type z from "zod";
import type { ContentItemSystemPayload, DeliveryClientSchema, ElementType } from "../../../lib/public_api.js";
import type { Asset } from "../../../lib/queries/content-items/models/element.models.js";
import { defineContentItem } from "../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { elementDef } from "../../../lib/queries/content-items/schemas/element.schemas.js";
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
		const schema = defineContentItem<typeof schemaInput, "actor", { title: ElementType.Text }>("actor", {
			title: elementDef.text,
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
	test("accepts any string", () => {
		expect(elementDef.text.safeParse({ type: "text", name: "Title", value: "" }).success).toBe(true);
		expect(elementDef.text.safeParse({ type: "text", name: "Title", value: "a".repeat(1000) }).success).toBe(true);
	});
});

describe("elementDef.number", () => {
	test("accepts null and a number", () => {
		expect(elementDef.number.safeParse({ type: "number", name: "Rating", value: null }).success).toBe(true);
		expect(elementDef.number.safeParse({ type: "number", name: "Rating", value: 5 }).success).toBe(true);
	});
});

describe("elementDef.dateTime", () => {
	test("accepts null and a string", () => {
		expect(elementDef.dateTime.safeParse({ type: "date_time", name: "Release", value: null, display_timezone: null }).success).toBe(
			true,
		);
		expect(
			elementDef.dateTime.safeParse({ type: "date_time", name: "Release", value: "2024-01-01T00:00:00.000Z", display_timezone: null })
				.success,
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
		expect(elementDef.richText.safeParse(makePayload()).success).toBe(true);
	});

	test("accepts empty images, links and modular_content", () => {
		const empty = { type: "rich_text", name: "Body", value: "", images: {}, links: {}, modular_content: [] };
		expect(elementDef.richText.safeParse(empty).success).toBe(true);
	});

	test("rejects payload with wrong discriminator type", () => {
		expect(elementDef.richText.safeParse({ ...makePayload(), type: "text" }).success).toBe(false);
	});

	test("rejects payload missing required fields", () => {
		const { images: _images, ...withoutImages } = makePayload();
		expect(elementDef.richText.safeParse(withoutImages).success).toBe(false);
	});
});

describe("elementDef.urlSlug", () => {
	test("accepts any string", () => {
		expect(elementDef.urlSlug.safeParse({ type: "url_slug", name: "Slug", value: "" }).success).toBe(true);
		expect(elementDef.urlSlug.safeParse({ type: "url_slug", name: "Slug", value: "my-slug" }).success).toBe(true);
	});
});

describe("elementDef.custom", () => {
	test("accepts null and a string", () => {
		expect(elementDef.custom.safeParse({ type: "custom", name: "ID", value: null }).success).toBe(true);
		expect(elementDef.custom.safeParse({ type: "custom", name: "ID", value: "abc" }).success).toBe(true);
	});
});

const makeAsset = (): Asset => ({
	name: "poster.jpg",
	description: null,
	type: "image/jpeg",
	size: 1024,
	url: "https://example.com/poster.jpg",
	width: 800,
	height: 600,
	renditions: {},
});

describe("elementDef.asset", () => {
	test("accepts empty value array and populated array", () => {
		expect(elementDef.asset.safeParse({ type: "asset", name: "Poster", value: [] }).success).toBe(true);
		expect(elementDef.asset.safeParse({ type: "asset", name: "Poster", value: [makeAsset()] }).success).toBe(true);
	});
});

describe("elementDef.multipleChoice", () => {
	test("accepts empty value array and populated array", () => {
		const schema = elementDef.multipleChoice();
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [] }).success).toBe(true);
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Lead", codename: "lead" }] }).success).toBe(true);
	});

	test("accepts any codename at runtime when codenames provided (type-only narrowing)", () => {
		const schema = elementDef.multipleChoice<"lead" | "supporting">();
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Extra", codename: "extra" }] }).success).toBe(
			true,
		);
		expect(schema.safeParse({ type: "multiple_choice", name: "Role", value: [{ name: "Lead", codename: "lead" }] }).success).toBe(true);
	});
});

describe("elementDef.taxonomy", () => {
	test("accepts empty value array and populated array", () => {
		const schema = elementDef.taxonomy();
		expect(schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [] }).success).toBe(true);
		expect(
			schema.safeParse({ type: "taxonomy", name: "Genre", taxonomy_group: "genre", value: [{ name: "Action", codename: "action" }] })
				.success,
		).toBe(true);
	});

	test("accepts any codename at runtime when codenames provided (type-only narrowing)", () => {
		const schema = elementDef.taxonomy<"action" | "drama">();
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

describe("elementDef.linkedItems", () => {
	test("accepts empty and populated value arrays", () => {
		const schema = elementDef.linkedItems();
		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: [], items: [] }).success).toBe(true);
		expect(schema.safeParse({ type: "modular_content", name: "Cast", value: ["actor_one", "actor_two"], items: [] }).success).toBe(
			true,
		);
	});

	test("rejects payload with wrong discriminator type", () => {
		const schema = elementDef.linkedItems();
		expect(schema.safeParse({ type: "text", name: "Cast", value: [], items: [] }).success).toBe(false);
	});

	test("items is typed as the generic argument at the TypeScript level", () => {
		type TaggedItem = { readonly tag: "movie" };
		type ItemsOf<T> = z.infer<ReturnType<typeof elementDef.linkedItems<T>>>["items"];
		const items: ItemsOf<TaggedItem> = [{ tag: "movie" }];
		expect(items.length).toBe(1);
	});
});
