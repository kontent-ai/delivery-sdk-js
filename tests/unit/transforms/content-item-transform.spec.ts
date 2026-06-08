import { describe, expect, it } from "vitest";
import type { DeliveryClientSchema } from "../../../lib/models/core.models.js";
import type { ContentItemPayload } from "../../../lib/queries/content-items/models/content-item.models.js";
import { joinItems, mapToExtendedItem, mapToExtendedModularContent } from "../../../lib/transforms/content-item-transforms.js";
import { getFakeUuid } from "../../utils/test.utils.js";

type TestSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["default"];
	readonly taxonomies: Record<string, never>;
	readonly contentTypeCodenames: readonly ["movie", "star"];
	readonly elementCodenames: readonly [];
	readonly collectionCodenames: readonly ["default"];
	readonly workflowCodenames: readonly ["default"];
	readonly workflowStepCodenames: readonly ["published"];
}>;

const createItem = (codename: string, type: "movie" | "star" = "star"): ContentItemPayload<TestSchema> => ({
	system: {
		id: getFakeUuid(),
		name: codename,
		codename,
		language: "default",
		type,
		collection: "default",
		last_modified: "2026-05-04T10:30:48.5100633Z",
		workflow: "default",
		workflow_step: "published",
		sitemap_locations: [],
	},
	elements: {
		firstname: {
			type: "text",
			name: "Firstname",
			value: codename,
		},
	},
});

const createItemWithReferences = (
	codename: string,
	richTextRefs: readonly string[],
	linkedItemRefs: readonly string[],
): ContentItemPayload<TestSchema> => ({
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
		description: {
			type: "rich_text",
			name: "Description",
			value: "<p>Some rich text</p>",
			images: {},
			links: {},
			modular_content: richTextRefs,
		},
		cast: {
			type: "modular_content",
			name: "Cast",
			value: linkedItemRefs,
		},
	},
});

describe("mapToExtendedItem", () => {
	it("populates rich text and linked items elements with referenced items from allItems", () => {
		const christianBale = createItem("christian_bale");
		const garyOldman = createItem("gary_oldman");
		const heathLedger = createItem("heath_ledger");

		const allItems = {
			christian_bale: christianBale,
			gary_oldman: garyOldman,
			heath_ledger: heathLedger,
		};

		const item = createItemWithReferences("the_dark_knight", ["heath_ledger"], ["christian_bale", "gary_oldman"]);

		const result = mapToExtendedItem({ allItems, item });

		const richText = result.elements.description;
		const linkedItems = result.elements.cast;

		if (richText?.type !== "rich_text") {
			throw new Error("Expected rich_text element");
		}
		if (linkedItems?.type !== "modular_content") {
			throw new Error("Expected modular_content element");
		}

		expect(richText.items).toHaveLength(1);
		expect(richText.items[0]).toBe(heathLedger);

		expect(linkedItems.items).toHaveLength(2);
		expect(linkedItems.items[0]).toBe(christianBale);
		expect(linkedItems.items[1]).toBe(garyOldman);
	});

	it("skips codenames that are not present in allItems", () => {
		const christianBale = createItem("christian_bale");
		const allItems = { christian_bale: christianBale };

		const item = createItemWithReferences("the_dark_knight", ["missing_codename"], ["christian_bale", "another_missing"]);

		const result = mapToExtendedItem({ allItems, item });

		const richText = result.elements.description;
		const linkedItems = result.elements.cast;

		if (richText?.type !== "rich_text" || linkedItems?.type !== "modular_content") {
			throw new Error("Unexpected element types");
		}

		expect(richText.items).toHaveLength(0);
		expect(linkedItems.items).toHaveLength(1);
		expect(linkedItems.items[0]).toBe(christianBale);
	});

	it("leaves non-referencing elements unchanged", () => {
		const item = createItem("plain_star");
		const result = mapToExtendedItem({ allItems: {}, item });

		const firstname = result.elements.firstname;
		if (firstname?.type !== "text") {
			throw new Error("Expected text element");
		}
		expect(firstname.value).toBe("plain_star");
	});
});

describe("mapToExtendedModularContent", () => {
	it("maps every record in modularContents and resolves their referenced items", () => {
		const christianBale = createItem("christian_bale");
		const garyOldman = createItem("gary_oldman");
		const heathLedger = createItem("heath_ledger");

		const movieA = createItemWithReferences("movie_a", ["heath_ledger"], ["christian_bale"]);
		const movieB = createItemWithReferences("movie_b", ["christian_bale"], ["gary_oldman", "heath_ledger"]);

		const modularContents = { movie_a: movieA, movie_b: movieB };
		const allItems = {
			christian_bale: christianBale,
			gary_oldman: garyOldman,
			heath_ledger: heathLedger,
			movie_a: movieA,
			movie_b: movieB,
		};

		const result = mapToExtendedModularContent({ allItems, modularContents });

		expect(Object.keys(result)).toHaveLength(Object.keys(modularContents).length);
		expect(Object.keys(result).sort()).toEqual(["movie_a", "movie_b"]);

		const movieARichText = result.movie_a?.elements.description;
		const movieALinkedItems = result.movie_a?.elements.cast;
		const movieBRichText = result.movie_b?.elements.description;
		const movieBLinkedItems = result.movie_b?.elements.cast;

		if (movieARichText?.type !== "rich_text" || movieALinkedItems?.type !== "modular_content") {
			throw new Error("movie_a has unexpected element types");
		}
		if (movieBRichText?.type !== "rich_text" || movieBLinkedItems?.type !== "modular_content") {
			throw new Error("movie_b has unexpected element types");
		}

		expect(movieARichText.items).toEqual([heathLedger]);
		expect(movieALinkedItems.items).toEqual([christianBale]);

		expect(movieBRichText.items).toEqual([christianBale]);
		expect(movieBLinkedItems.items).toEqual([garyOldman, heathLedger]);
	});

	it("returns an empty record when modularContents is empty", () => {
		const result = mapToExtendedModularContent({ allItems: {}, modularContents: {} });
		expect(Object.keys(result)).toHaveLength(0);
	});
});

describe("joinItems", () => {
	it("joins items and modularContent into a single record keyed by codename, preserving the source size when codenames are unique", () => {
		const itemA = createItem("item_a");
		const itemB = createItem("item_b");
		const modularA = createItem("modular_a");
		const modularB = createItem("modular_b");

		const result = joinItems({
			items: [itemA, itemB],
			modularContent: [{ modular_a: modularA, modular_b: modularB }],
		});

		const sourceSize = 2 + Object.keys({ modular_a: modularA, modular_b: modularB }).length;

		expect(Object.keys(result)).toHaveLength(sourceSize);
		expect(result.item_a).toBe(itemA);
		expect(result.item_b).toBe(itemB);
		expect(result.modular_a).toBe(modularA);
		expect(result.modular_b).toBe(modularB);
	});

	it("merges multiple modularContent records and items together", () => {
		const itemA = createItem("item_a");
		const modularA = createItem("modular_a");
		const modularB = createItem("modular_b");

		const result = joinItems({
			items: [itemA],
			modularContent: [{ modular_a: modularA }, { modular_b: modularB }],
		});

		expect(Object.keys(result)).toHaveLength(3);
		expect(result.item_a).toBe(itemA);
		expect(result.modular_a).toBe(modularA);
		expect(result.modular_b).toBe(modularB);
	});

	it("deduplicates entries with the same codename, so the result is smaller than the source", () => {
		const sharedFromItems = createItem("shared");
		const sharedFromModular = createItem("shared");
		const uniqueItem = createItem("unique_item");
		const uniqueModular = createItem("unique_modular");

		const modularRecord = { shared: sharedFromModular, unique_modular: uniqueModular };
		const items = [sharedFromItems, uniqueItem];

		const sourceSize = items.length + Object.keys(modularRecord).length;

		const result = joinItems({
			items,
			modularContent: [modularRecord],
		});

		expect(Object.keys(result).length).toBeLessThan(sourceSize);
		expect(Object.keys(result)).toHaveLength(3);
		expect(Object.keys(result).sort()).toEqual(["shared", "unique_item", "unique_modular"]);
		expect(result.shared).toBe(sharedFromItems);
		expect(result.unique_item).toBe(uniqueItem);
		expect(result.unique_modular).toBe(uniqueModular);
	});
});
