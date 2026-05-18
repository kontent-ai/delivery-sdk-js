import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListLanguagesPayload } from "../../../../lib/queries/languages/models/language.models.js";
import { listLanguagesSchema } from "../../../../lib/queries/languages/schemas/language.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import rawPayload from "./list-languages-query.payload.js";

describe("List languages query", async () => {
	await runQueryTestsAsync<ListLanguagesPayload<DeliveryClientSchema>>({
		endpoint: "languages",
		rawPayload,
		selectQuery: (client) => client.listLanguages(),
		expectedSchema: listLanguagesSchema(),
	});
});
