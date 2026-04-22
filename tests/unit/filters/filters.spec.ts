import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Filters", () => {
	const client = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
	});

	it("Filter defined as object should be added to the url", () => {
		const { data } = client
			.listContentItems({
				filters: [
					{
						property: "system.language",
						operator: "eq",
						value: "default",
					},
				],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("system.language[eq]=default").toString());
	});

	it("Filter defined as string should be added to the url", () => {
		const { data } = client
			.listContentItems({
				filters: ["system.language[eq]=default"],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("system.language[eq]=default").toString());
	});

	it("Handle multiple equal signs in value", () => {
		const { data } = client
			.listContentItems({
				filters: ["system.codename[eq]=abc=def"],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("system.codename[eq]=abc=def").toString());
	});

	it("Filter defined as string with value containing '=' should be added to the url correctly", () => {
		const { data } = client
			.listContentItems({
				filters: [
					{
						property: "system.language",
						operator: "=",
						value: "default",
					},
				],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("system.language=default").toString());
	});

	it("Filter defined as string with value containing '!=' should be added to the url correctly", () => {
		const { data } = client
			.listContentItems({
				filters: [
					{
						property: "system.language",
						operator: "!=",
						value: "default",
					},
				],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("system.language[neq]=default").toString());
	});

	it("isEmptyRichText filter should produce [eq]=<p><br></p> in the url", () => {
		const { data } = client
			.listContentItems({
				filters: [
					{
						property: "elements.description",
						operator: "isEmptyRichText",
					},
				],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("elements.description[eq]=<p><br></p>").toString());
	});

	it("isNotEmptyRichText filter should produce [neq]=<p><br></p> in the url", () => {
		const { data } = client
			.listContentItems({
				filters: [
					{
						property: "elements.description",
						operator: "isNotEmptyRichText",
					},
				],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("elements.description[neq]=<p><br></p>").toString());
	});

	it("Filters defined as both object and string should all be added to the url", () => {
		const { data } = client
			.listContentItems({
				filters: [
					{
						property: "system.language",
						operator: "eq",
						value: "default",
					},
					"system.type[eq]=movie",
				],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("system.language[eq]=default").toString());
		expect(data?.url.toString()).toContain(new URLSearchParams("system.type[eq]=movie").toString());
	});
});
