import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import { type ContentTypeElementPayload, contentTypeElementPayload } from "../../../../lib/queries/content-types/content-type.models.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./fetch-content-type-element-query.payload.js";

describe("Fetch content type element query", async () => {
	const typeCodename = "movie";
	const elementCodename = "title";
	await runQueryTestsAsync<ContentTypeElementPayload<DeliveryClientSchema>>({
		endpoint: `types/${typeCodename}/elements/${elementCodename}`,
		unitTestPayload,
		selectQuery: (client) => client.fetchContentTypeElement({ typeCodename, elementCodename }),
		expectedSchema: contentTypeElementPayload(getIntegrationTestsSchema()),
	});
});
