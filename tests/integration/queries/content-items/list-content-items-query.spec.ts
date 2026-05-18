import { describe } from "vitest";
import type {
	ListContentItemsPayload,
	ListContentItemsPayloadExtended,
} from "../../../../lib/queries/content-items/models/content-item.models.js";
import {
	listContentItemsSchema,
	listContentItemsSchemaExtended,
} from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import { registerMovieCastExtraTests } from "../../models/integration-test.extra-tests.js";
import type { IntegrationTestProjectSchema } from "../../models/integration-test.schema.js";
import rawPayload from "./list-content-items-query.payload.js";

describe("List content items query", async () => {
	await runQueryTestsAsync<ListContentItemsPayload<IntegrationTestProjectSchema>, IntegrationTestProjectSchema>({
		endpoint: "items",
		rawPayload,
		selectQuery: (client) => client.listContentItems().raw(),
		expectedSchema: listContentItemsSchema<IntegrationTestProjectSchema>(),
	});
});

describe("List content items query - extended", async () => {
	await runQueryTestsAsync<ListContentItemsPayloadExtended<IntegrationTestProjectSchema>, IntegrationTestProjectSchema>({
		endpoint: "items",
		rawPayload: undefined,
		selectQuery: (client) => client.listContentItems(),
		expectedSchema: listContentItemsSchemaExtended<IntegrationTestProjectSchema>(),
		extraTests: (response) => registerMovieCastExtraTests(response.items),
	});
});
