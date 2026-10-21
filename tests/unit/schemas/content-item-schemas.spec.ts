import { describe, expect, it } from "vitest";
import type { DeliveryClientSchema } from "../../../lib/models/core.models.js";
import {
	contentItemSchemaExtended,
	contentItemSystemWithCodename,
} from "../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { elementDef } from "../../../lib/queries/content-items/schemas/element.schemas.js";
import { getFakeUuid } from "../../utils/test.utils.js";

type TestSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["default"];
	readonly taxonomies: Record<string, never>;
	readonly contentTypes: {
		readonly movie: readonly [];
	};
	readonly collectionCodenames: readonly ["default"];
	readonly workflowCodenames: readonly ["default"];
	readonly workflowStepCodenames: readonly ["published"];
}>;

describe("contentItemSystemWithCodename", () => {
	it("parses a system payload whose type matches the literal codename", () => {
		const result = contentItemSystemWithCodename<TestSchema, "movie">("movie").safeParse({
			id: getFakeUuid(),
			name: "The Dark Knight",
			codename: "the_dark_knight",
			language: "default",
			type: "movie",
			collection: "default",
			last_modified: "2026-05-04T10:30:48.5100633Z",
			workflow: "default",
			workflow_step: "published",
			sitemap_locations: [],
		});
		expect(result.success).toBe(true);
	});
});

describe("elementDef.richText extended items validator", () => {
	it("invokes the custom check and rejects an invalid resolved item", () => {
		const result = elementDef.richText().safeParse({
			type: "rich_text",
			name: "Description",
			value: "<p>x</p>",
			images: {},
			links: {},
			modular_content: ["some_codename"],
			items: [{ not: "a valid extended content item" }],
		});
		expect(result.success).toBe(false);
	});
});

describe("elementDef.linkedItems extended items validator", () => {
	it("rejects a resolved item without system", () => {
		const result = elementDef.linkedItems().safeParse({
			type: "modular_content",
			name: "Related",
			value: ["some_codename"],
			items: [{ elements: {} }],
		});
		expect(result.success).toBe(false);
	});
});

describe("contentItemSchemaExtended with circular linked items", () => {
	const createItem = (codename: string) => {
		const item = {
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
					value: [] as string[],
					items: [] as unknown[],
				},
			},
		};
		return item;
	};

	const link = (from: ReturnType<typeof createItem>, to: ReturnType<typeof createItem>): void => {
		from.elements.related.value.push(to.system.codename);
		from.elements.related.items.push(to);
	};

	it("parses a self-referencing item", () => {
		const item = createItem("a");
		link(item, item);

		expect(contentItemSchemaExtended<TestSchema>().safeParse(item).success).toBe(true);
	});

	it("parses items that reference each other", () => {
		const a = createItem("a");
		const b = createItem("b");
		link(a, b);
		link(b, a);

		expect(contentItemSchemaExtended<TestSchema>().safeParse(a).success).toBe(true);
		expect(contentItemSchemaExtended<TestSchema>().safeParse(b).success).toBe(true);
	});
});
