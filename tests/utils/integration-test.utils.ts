import type { JsonValue, Query } from "@kontent-ai/core-sdk";
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { expect, it } from "vitest";
import type { ZodType } from "zod";
import type { DeliveryClient, DeliveryClientTypes, DeliveryEndpoints } from "../../lib/models/core.models.js";
import { createDeliveryClient } from "../../lib/public_api.js";
import { getDeliveryUrl } from "../../lib/utils/url.utils.js";
import { getIntegrationTestConfig } from "../integration-tests.config.js";
import { isPagingQuery, unitEnvironmentId } from "./test.utils.js";

export async function runQueryIntegrationTestsAsync<TResponsePayload extends JsonValue>({
	endpoint,
	unitTestPayload,
	selectQuery,
	expectedSchema,
}: {
	readonly expectedSchema: ZodType<TResponsePayload>;
	readonly endpoint: DeliveryEndpoints;
	readonly unitTestPayload: TResponsePayload;
	readonly selectQuery: (client: DeliveryClient<DeliveryClientTypes>) => Query<TResponsePayload, unknown>;
}): Promise<void> {
	const integrationTextConfig = getIntegrationTestConfig();

	const clients: readonly DeliveryClient<DeliveryClientTypes>[] = [
		createDeliveryClient(unitEnvironmentId)
			.withUnknownSchema()
			.publicApi()
			.create({
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: unitTestPayload,
					statusCode: 200,
				}),
			}),
		createDeliveryClient(integrationTextConfig.env.id).withUnknownSchema().publicApi().create({
			baseUrl: integrationTextConfig.env.deliveryBaseUrl,
		}),
	];

	for (const client of clients) {
		const isIntegrationTest = client.config.environmentId === integrationTextConfig.env.id;
		const testType = isIntegrationTest ? "Integration" : "Unit";
		const testName = `${testType}[${endpoint}]: `;

		const query = selectQuery(client);
		const { response, success, error } = await query.toPromise();

		it(`${testName} Expect url to be correct`, () => {
			expect(query.toUrl()).toBe(
				`${getDeliveryUrl({ apiMode: "public", environmentId: client.config.environmentId, path: endpoint })}`,
			);
		});

		it(`${testName} Response should be successful`, () => {
			expect(success).toBeTruthy();
			expect(error).toBeUndefined();
		});

		it(`${testName} Response payload should match schema`, async () => {
			const { error: parseError, success: parseSuccess } = await expectedSchema.safeParseAsync(response?.payload);
			expect(parseSuccess).toBeTruthy();
			expect(parseError).toBeUndefined();
		});

		if (testType === "Unit") {
			it(`${testName} Payload should be equal to unit test payload`, () => {
				expect(response?.payload).toEqual(unitTestPayload);
			});
		}

		if (isPagingQuery(query)) {
			const { responses: pagingResponses, success: pagingSuccess, error: pagingError } = await query.toAllPromise();

			it(`${testName} Response should be successful`, () => {
				expect(pagingSuccess).toBeTruthy();
				expect(pagingError).toBeUndefined();
			});

			if (testType === "Unit") {
				const firstResponse = pagingResponses?.[0];

				it(`${testName} First paging response payload should match schema`, () => {
					expect(firstResponse?.payload).toEqual(unitTestPayload);
				});
			}

			it(`${testName} First paging response payload should match schema`, async () => {
				const { error: parseError, success: parseSuccess } = await expectedSchema.safeParseAsync(response?.payload);
				expect(parseSuccess).toBeTruthy();
				expect(parseError).toBeUndefined();
			});

			const iteratorPayloads: TResponsePayload[] = [];
			const maxPagesCount = 1;
			for await (const response of query.pages({ maxPagesCount })) {
				iteratorPayloads.push(response?.payload);
			}

			it(`${testName} Iterator responses should be equal to paging responses`, () => {
				expect(iteratorPayloads.length).toEqual(maxPagesCount);
			});

			if (testType === "Unit") {
				const firstIteratorResponse = iteratorPayloads?.[0];

				it(`${testName} First iterator response payload should match schema`, () => {
					expect(firstIteratorResponse).toEqual(unitTestPayload);
				});
			}
		}
	}
}
