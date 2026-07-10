import { describe, expect, it } from "vitest";
import type { DeliveryClientConfig } from "../../../lib/models/core.models.js";
import { fetchContentItemQuery } from "../../../lib/queries/content-items/fetch-content-item-query.js";
import { itemsReferencingAssetQuery } from "../../../lib/queries/content-items/items-referencing-asset-query.js";
import { itemsReferencingItemQuery } from "../../../lib/queries/content-items/items-referencing-item-query.js";
import { fetchContentTypeElementQuery } from "../../../lib/queries/content-types/fetch-content-type-element-query.js";
import { fetchContentTypeQuery } from "../../../lib/queries/content-types/fetch-content-type-query.js";
import { fetchTaxonomyQuery } from "../../../lib/queries/taxonomies/fetch-taxonomy-query.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

const clientConfig: DeliveryClientConfig = {
	apiMode: "public",
	environmentId: unitEnvironmentId,
};

// A codename crafted to break out of its path segment and inject a new query if left unencoded.
const maliciousCodename = "my item/../x?a=1#f";
const encodedCodename = encodeURIComponent(maliciousCodename);

describe("URL path segment encoding", () => {
	it("encodes the encoded segment so reserved characters are escaped", () => {
		// Sanity check on the expectation itself.
		expect(encodedCodename).toBe("my%20item%2F..%2Fx%3Fa%3D1%23f");
		expect(encodedCodename).not.toContain("/");
		expect(encodedCodename).not.toContain("?");
		expect(encodedCodename).not.toContain("#");
	});

	it("encodes the codename in fetchContentItemQuery (items/{codename})", () => {
		const url = fetchContentItemQuery(clientConfig, { codename: maliciousCodename }).inspect().data?.url?.toString() ?? "";

		expect(url).toContain(`/items/${encodedCodename}`);
		// The raw codename must not appear as a real path/query break.
		expect(url).not.toContain(maliciousCodename);
		// No extra segment or query smuggled in.
		const { pathname, search } = new URL(url);
		expect(pathname.endsWith(`/items/${encodedCodename}`)).toBe(true);
		expect(search).toBe("");
	});

	it("encodes the codename in fetchContentTypeQuery (types/{codename})", () => {
		const url = fetchContentTypeQuery(clientConfig, { codename: maliciousCodename }).inspect().data?.url?.toString() ?? "";

		expect(url).toContain(`/types/${encodedCodename}`);
		expect(new URL(url).search).toBe("");
	});

	it("encodes the codename in fetchTaxonomyQuery (taxonomies/{codename})", () => {
		const url = fetchTaxonomyQuery(clientConfig, { codename: maliciousCodename }).inspect().data?.url?.toString() ?? "";

		expect(url).toContain(`/taxonomies/${encodedCodename}`);
		expect(new URL(url).search).toBe("");
	});

	it("encodes the codename in itemsReferencingItemQuery (items/{codename}/used-in)", () => {
		const url = itemsReferencingItemQuery(clientConfig, { codename: maliciousCodename }).inspect().data?.url?.toString() ?? "";

		expect(url).toContain(`/items/${encodedCodename}/used-in`);
		expect(new URL(url).search).toBe("");
	});

	it("encodes the codename in itemsReferencingAssetQuery (assets/{codename}/used-in)", () => {
		const url = itemsReferencingAssetQuery(clientConfig, { codename: maliciousCodename }).inspect().data?.url?.toString() ?? "";

		expect(url).toContain(`/assets/${encodedCodename}/used-in`);
		expect(new URL(url).search).toBe("");
	});

	it("encodes both segments in fetchContentTypeElementQuery (types/{type}/elements/{element})", () => {
		const url =
			fetchContentTypeElementQuery(clientConfig, {
				typeCodename: maliciousCodename,
				elementCodename: maliciousCodename,
			})
				.inspect()
				.data?.url?.toString() ?? "";

		expect(url).toContain(`/types/${encodedCodename}/elements/${encodedCodename}`);
		expect(new URL(url).search).toBe("");
	});
});
