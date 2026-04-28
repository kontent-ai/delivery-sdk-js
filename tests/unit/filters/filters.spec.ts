import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Filters", () => {
	const client = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
	});

	it("adds an object filter to the URL", () => {
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

	it("adds a string filter to the URL", () => {
		const { data } = client
			.listContentItems({
				filters: ["system.language[eq]=default"],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("system.language[eq]=default").toString());
	});

	it("handles multiple equal signs in the filter value", () => {
		const { data } = client
			.listContentItems({
				filters: ["system.codename[eq]=abc=def"],
			})
			.inspect();

		expect(data?.url.toString()).toContain(new URLSearchParams("system.codename[eq]=abc=def").toString());
	});

	it("handles the '=' operator", () => {
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

	it("handles the '!=' operator", () => {
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

	it("adds [eq]=<p><br></p> for isEmptyRichText operator", () => {
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

	it("adds [neq]=<p><br></p> for isNotEmptyRichText operator", () => {
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

	it("adds both object and string filters to the URL", () => {
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
