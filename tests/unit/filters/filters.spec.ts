import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Filters", () => {
	const client = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
	});

	it("Filter defined as object should be added to the url", () => {
		const url = client.listContentItems({
			filters: [
				{
					property: "system.language",
					operator: "eq",
					value: "default",
				},
			],
		}).url;

		expect(url).toContain("system.language[eq]=default");
	});

	it("Filter defined as string should be added to the url", () => {
		const url = client.listContentItems({
			filters: ["system.language[eq]=default"],
		}).url;

		expect(url).toContain("system.language[eq]=default");
	});

	it("Handle multiple equal signs in value", () => {
		const url = client.listContentItems({
			filters: ["system.codename[eq]=abc=def"],
		}).url;

		expect(url).toContain("system.codename[eq]=abc%3Ddef");
	});

	it("Filter defined as string with value containing '=' should be added to the url correctly", () => {
		const url = client.listContentItems({
			filters: [
				{
					property: "system.language",
					operator: "=",
					value: "default",
				},
			],
		}).url;

		expect(url).toContain("system.language=default");
	});

	it("Filters defined as both object and string should all be added to the url", () => {
		const url = client.listContentItems({
			filters: [
				{
					property: "system.language",
					operator: "eq",
					value: "default",
				},
				"system.type[eq]=movie",
			],
		}).url;

		expect(url).toContain("system.language[eq]=default");
		expect(url).toContain("system.type[eq]=movie");
	});
});
