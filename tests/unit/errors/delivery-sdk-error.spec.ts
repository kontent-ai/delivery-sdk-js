import { getDefaultHttpService, isKontentSdkError, KontentSdkError } from "@kontent-ai/core-sdk";
import { describe, expect, expectTypeOf, it } from "vitest";
import { DeliverySdkError } from "../../../lib/models/error.models.js";
import { createDeliveryClient, isDeliverySdkError } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("DeliverySdkError", async () => {
	const { error } = await createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		httpService: getDefaultHttpService({
			adapter: {
				executeRequest: () => {
					throw new Error("Simulated failure");
				},
			},
		}),
	})
		.listLanguages()
		.fetchPageSafe();

	it("returns a DeliverySdkError on failure", () => {
		expect(error).toBeInstanceOf(DeliverySdkError);
	});

	it("is recognized by isDeliverySdkError", () => {
		expect(isDeliverySdkError(error)).toBe(true);
	});

	it("is recognized by isKontentSdkError", () => {
		expect(isKontentSdkError(error)).toBe(true);
	});

	it("carries the DeliverySdkError brand", () => {
		expect((error as unknown as Record<symbol, unknown>)[Symbol.for("kontentAi.DeliverySdkError")]).toBe(true);
	});
});

describe("isDeliverySdkError", () => {
	it("recognizes a branded error from a different package copy", () => {
		const foreignError = Object.assign(new Error("Foreign"), { [Symbol.for("kontentAi.DeliverySdkError")]: true });

		expect(isDeliverySdkError(foreignError)).toBe(true);
	});

	it("rejects a KontentSdkError that is not a DeliverySdkError", () => {
		const coreError = new KontentSdkError({
			baseErrorData: { message: "Core", url: "https://kontent.ai", retryStrategyOptions: undefined, retryAttempt: undefined },
			details: { reason: "adapterError", originalError: undefined },
		});

		expect(isDeliverySdkError(coreError)).toBe(false);
	});

	it("rejects a plain Error", () => {
		expect(isDeliverySdkError(new Error("Plain"))).toBe(false);
	});

	it("rejects an object with a falsy brand", () => {
		expect(isDeliverySdkError({ [Symbol.for("kontentAi.DeliverySdkError")]: false })).toBe(false);
	});

	it("rejects null", () => {
		expect(isDeliverySdkError(null)).toBe(false);
	});

	it("rejects undefined", () => {
		expect(isDeliverySdkError(undefined)).toBe(false);
	});

	it("rejects a string", () => {
		expect(isDeliverySdkError("DeliverySdkError")).toBe(false);
	});

	it("narrows unknown to DeliverySdkError", () => {
		const value: unknown = undefined;

		if (isDeliverySdkError(value)) {
			expectTypeOf(value).toEqualTypeOf<DeliverySdkError>();
		}
	});
});
