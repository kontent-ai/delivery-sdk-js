import { describe, expect, it } from "vitest";
import type { DeliveryClientSchema } from "../../../lib/models/core.models.js";
import { contentItemSystemWithCodename } from "../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { elementDef } from "../../../lib/queries/content-items/schemas/element.schemas.js";
import { getFakeUuid } from "../../utils/test.utils.js";

type TestSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["default"];
	readonly taxonomyCodenames: readonly [];
	readonly contentTypeCodenames: readonly ["movie"];
	readonly elementCodenames: readonly [];
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
