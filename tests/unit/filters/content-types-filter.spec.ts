import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("contentTypes request parameter", () => {
	const client = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
	});

	it("adds a system.type[in] filter for listContentItems", () => {
		const { data } = client.listContentItems({ ofContentTypes: ["movie", "actor"] }).inspect();
		console.log(data?.url);

		expect(data?.url.searchParams.get("system.type[in]")).toStrictEqual("movie,actor");
	});

	it("adds a system.type[in] filter for itemsFeed", () => {
		const { data } = client.itemsFeed({ ofContentTypes: ["movie"] }).inspect();

		expect(data?.url.searchParams.get("system.type[in]")).toStrictEqual("movie");
	});

	it("keeps existing filters", () => {
		const { data } = client
			.listContentItems({
				ofContentTypes: ["movie"],
				filters: [{ property: "system.language", operator: "eq", value: "default" }],
			})
			.inspect();

		expect(data?.url.searchParams.get("system.language[eq]")).toStrictEqual("default");
		expect(data?.url.searchParams.get("system.type[in]")).toStrictEqual("movie");
	});

	it("adds no filter for an empty list", () => {
		const { data } = client.listContentItems({ ofContentTypes: [] }).inspect();

		expect(data?.url.searchParams.has("system.type[in]")).toBe(false);
		expect(data?.url.searchParams.has("contentTypes")).toBe(false);
	});

	it("serializes number ranges", () => {
		const { data } = client
			.listContentItems({ filters: [{ property: "elements.rating", operator: "range", value: [7, 10] }] })
			.inspect();

		expect(data?.url.searchParams.get("elements.rating[range]")).toStrictEqual("7,10");
	});
});
