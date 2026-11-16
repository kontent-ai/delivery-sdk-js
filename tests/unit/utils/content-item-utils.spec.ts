import { describe, expect, it } from "vitest";
import { isContentItemOfType } from "../../../lib/utils/content-item.utils.js";

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
