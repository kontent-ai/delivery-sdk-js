import { describe, expect, it } from "vitest";
import { addQueryParametersToUrl } from "../../../lib/utils/url.utils.js";

describe("addQueryParametersToUrl", () => {
	const baseUrl = "https://deliver.kontent.ai/xyz/languages";

	it("returns URL unchanged when query is undefined", () => {
		expect(addQueryParametersToUrl(baseUrl, undefined)).toStrictEqual(baseUrl);
	});

	it("appends parameters with ? when URL has no existing query string", () => {
		const result = addQueryParametersToUrl(baseUrl, { skip: "5" });

		expect(result).toStrictEqual(`${baseUrl}?skip=5`);
	});

	it("appends parameters with & when URL already contains a query string", () => {
		const urlWithQuery = `${baseUrl}?existing=1`;
		const result = addQueryParametersToUrl(urlWithQuery, { skip: "2" });

		expect(result).toStrictEqual(`${urlWithQuery}&skip=2`);
	});

	it("converts number values to strings", () => {
		const result = addQueryParametersToUrl(baseUrl, { skip: 3, limit: 7 });
		const params = new URL(result).searchParams;

		expect(params.get("skip")).toStrictEqual("3");
		expect(params.get("limit")).toStrictEqual("7");
	});

	it("omits undefined query parameter values", () => {
		const result = addQueryParametersToUrl(baseUrl, { skip: 1, limit: undefined });
		const params = new URL(result).searchParams;

		expect(params.get("skip")).toStrictEqual("1");
		expect(params.has("limit")).toBe(false);
	});
});
