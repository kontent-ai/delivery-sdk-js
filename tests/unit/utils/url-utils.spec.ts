import { describe, expect, it } from "vitest";
import { addQueryParametersToUrl, isEmptyRichtextFilter } from "../../../lib/utils/url.utils.js";

describe("addQueryParametersToUrl", () => {
	const baseUrl = "https://deliver.kontent.ai/xyz/languages";

	it("returns URL unchanged when query is undefined", () => {
		expect(addQueryParametersToUrl(baseUrl, undefined, undefined)).toStrictEqual(baseUrl);
	});

	it("appends parameters with ? when URL has no existing query string", () => {
		const result = addQueryParametersToUrl(baseUrl, { skip: "5" }, undefined);

		expect(result).toStrictEqual(`${baseUrl}?skip=5`);
	});

	it("appends parameters with & when URL already contains a query string", () => {
		const urlWithQuery = `${baseUrl}?existing=1`;
		const result = addQueryParametersToUrl(urlWithQuery, { skip: "2" }, undefined);

		expect(result).toStrictEqual(`${urlWithQuery}&skip=2`);
	});

	it("converts number values to strings", () => {
		const result = addQueryParametersToUrl(baseUrl, { skip: 3, limit: 7 }, undefined);
		const params = new URL(result).searchParams;

		expect(params.get("skip")).toStrictEqual("3");
		expect(params.get("limit")).toStrictEqual("7");
	});

	it("omits undefined query parameter values", () => {
		const result = addQueryParametersToUrl(baseUrl, { skip: 1, limit: undefined }, undefined);
		const params = new URL(result).searchParams;

		expect(params.get("skip")).toStrictEqual("1");
		expect(params.has("limit")).toBe(false);
	});

	it("omits undefined filter values", () => {
		const result = addQueryParametersToUrl(baseUrl, undefined, [{ property: "system.language", operator: "eq", value: undefined }]);
		const params = new URL(result).searchParams;

		expect(params.has("system.language")).toBe(false);
	});

	it("omits filter with undefined value", () => {
		const result = addQueryParametersToUrl(baseUrl, undefined, [{ property: "system.language", operator: "eq", value: undefined }]);
		const params = new URL(result).searchParams;

		expect(params.has("system.language")).toBe(false);
	});
});

describe("isEmptyRichtextFilter", () => {
	it("returns true for object with isEmptyRichText operator", () => {
		expect(isEmptyRichtextFilter({ property: "elements.description", operator: "isEmptyRichText" })).toBe(true);
	});

	it("returns true for object with isNotEmptyRichText operator", () => {
		expect(isEmptyRichtextFilter({ property: "elements.description", operator: "isNotEmptyRichText" })).toBe(true);
	});

	it("returns false for object with a different operator", () => {
		expect(isEmptyRichtextFilter({ property: "elements.description", operator: "eq", value: "test" })).toBe(false);
	});

	it("returns false for object missing operator", () => {
		expect(isEmptyRichtextFilter({ property: "elements.description" })).toBe(false);
	});

	it("returns false for null", () => {
		expect(isEmptyRichtextFilter(null)).toBe(false);
	});

	it("returns false for a string", () => {
		expect(isEmptyRichtextFilter("elements.description[eq]=test")).toBe(false);
	});
});
