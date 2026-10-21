import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListTaxonomiesPayload } from "../../../../lib/queries/taxonomies/models/taxonomy.models.js";
import { listTaxonomiesSchema } from "../../../../lib/queries/taxonomies/schemas/taxonomy.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import rawPayload from "./list-taxonomies-query.payload.js";

describe("List taxonomies query", async () => {
	await runQueryTestsAsync<ListTaxonomiesPayload<DeliveryClientSchema>>({
		endpoint: "taxonomies",
		rawPayload,
		selectQuery: (client) => client.listTaxonomies(),
		expectedSchema: listTaxonomiesSchema(),
	});
});
