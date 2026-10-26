import { getDefaultHttpService, type JsonValue } from "@kontent-ai/core-sdk";
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import type { ZodMiniType } from "@zod/mini";
import { expect } from "vitest";
import type { DeliveryClient, DeliveryClientSchema, DeliveryEndpoint } from "../../lib/models/core.models.js";
import { createDeliveryClient } from "../../lib/public_api.js";
import { getDeliveryUrl } from "../../lib/utils/url.utils.js";
import { getIntegrationTestConfig } from "../integration-tests.config.js";
import { unitEnvironmentId } from "./test.utils.js";

/**
 * Client whose every request responds with `payload` (status 200).
 */
export function createMockedClient<TSchema extends DeliveryClientSchema = DeliveryClientSchema>(
	payload: JsonValue,
): DeliveryClient<TSchema> {
	return createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		httpService: getTestHttpServiceWithJsonResponse({
			jsonResponse: payload,
			statusCode: 200,
		}),
	});
}

/**
 * Client targeting the live integration environment configured via `.env` / environment variables.
 */
export function createIntegrationClient<TSchema extends DeliveryClientSchema = DeliveryClientSchema>(): DeliveryClient<TSchema> {
	const { env } = getIntegrationTestConfig();

	return createDeliveryClient({
		apiMode: "public",
		environmentId: env.id,
		...(env.deliveryBaseUrl ? { baseUrl: env.deliveryBaseUrl } : {}),
	});
}

/**
 * Client whose HTTP adapter throws on every request.
 */
export function createFailingClient<TSchema extends DeliveryClientSchema = DeliveryClientSchema>(): DeliveryClient<TSchema> {
	return createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		httpService: getDefaultHttpService({
			adapter: {
				executeRequest: () => {
					throw new Error("Simulated failure");
				},
			},
		}),
	});
}

export function getExpectedUrl<TSchema extends DeliveryClientSchema>(client: DeliveryClient<TSchema>, path: DeliveryEndpoint): URL {
	return new URL(getDeliveryUrl({ apiMode: "public", environmentId: client.config.environmentId, path }));
}

/**
 * Asserts that `payload` matches `schema`, reporting the schema error message on failure.
 */
export async function expectToMatchSchema(schema: ZodMiniType, payload: unknown): Promise<void> {
	const { success, error } = await schema.safeParseAsync(payload);
	expect(success, error?.message).toBe(true);
}
