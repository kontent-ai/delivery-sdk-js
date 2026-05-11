import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListLanguagesPayload } from "../../../../lib/queries/languages/language.models.js";
import { listLanguagesSchema } from "../../../../lib/queries/languages/language.schemas.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./list-languages-query.payload.js";

describe("List languages query", async () => {
	await runQueryTestsAsync<ListLanguagesPayload<DeliveryClientSchema>>({
		endpoint: "languages",
		unitTestPayload,
		selectQuery: (client) => client.listLanguages(),
		expectedSchema: listLanguagesSchema(getIntegrationTestsSchema()),
	});
});
