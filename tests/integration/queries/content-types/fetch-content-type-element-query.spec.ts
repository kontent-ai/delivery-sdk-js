import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import { type ContentTypeElementPayload, contentTypeElementPayload } from "../../../../lib/queries/content-types/content-type.models.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import payloads from "./fetch-content-type-element-query.payload.js";

describe("Fetch content type element query", async () => {
	const typeCodename = "movie";

	for (const payload of payloads) {
		await runQueryTestsAsync<ContentTypeElementPayload<DeliveryClientSchema>>({
			endpoint: `types/${typeCodename}/elements/${payload.codename}`,
			unitTestPayload: payload,
			selectQuery: (client) => client.fetchContentTypeElement({ typeCodename, elementCodename: payload.codename }),
			expectedSchema: contentTypeElementPayload(getIntegrationTestsSchema()),
		});
	}
});
