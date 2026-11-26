import { describe, expect, it } from "vitest";
import { isContentItemOfType, isContentItemWithSnippet } from "../../../lib/utils/content-item.utils.js";

const item = (type: string) => ({ system: { type, codename: `${type}_item` } }) as const;

describe("isContentItemOfType", () => {
	it("matches a single content type", () => {
		expect(isContentItemOfType(item("movie"), "movie")).toBe(true);
		expect(isContentItemOfType(item("actor"), "movie")).toBe(false);
	});

	it("matches any of several content types", () => {
		expect(isContentItemOfType(item("actor"), ["movie", "actor"])).toBe(true);
		expect(isContentItemOfType(item("director"), ["movie", "actor"])).toBe(false);
	});

	it("returns false for missing items", () => {
		expect(isContentItemOfType(undefined, "movie")).toBe(false);
		expect(isContentItemOfType(null, "movie")).toBe(false);
	});
});

const itemWithElements = (elements: readonly string[]) => ({
	system: { type: "movie", codename: "movie_item" },
	elements: Object.fromEntries(elements.map((codename) => [codename, { type: "text", name: codename, value: "" }])),
});

describe("isContentItemWithSnippet", () => {
	it("matches items with elements of the snippet", () => {
		expect(isContentItemWithSnippet(itemWithElements(["title", "metadata__title"]), "metadata")).toBe(true);
	});

	it("does not match items without elements of the snippet", () => {
		expect(isContentItemWithSnippet(itemWithElements(["title", "seo__title"]), "metadata")).toBe(false);
		expect(isContentItemWithSnippet(itemWithElements(["metadata_title"]), "metadata")).toBe(false);
	});

	it("does not match items whose snippet elements were removed by a projection", () => {
		expect(isContentItemWithSnippet(itemWithElements(["title"]), "metadata")).toBe(false);
	});

	it("returns false for missing items", () => {
		expect(isContentItemWithSnippet(undefined, "metadata")).toBe(false);
		expect(isContentItemWithSnippet(null, "metadata")).toBe(false);
	});
});
