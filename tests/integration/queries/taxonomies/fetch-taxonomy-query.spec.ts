import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import { type TaxonomyPayload, taxonomyPayload } from "../../../../lib/queries/taxonomies/taxonomy.models.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./fetch-taxonomy-query.payload.js";

describe("Fetch taxonomy query", async () => {
	const codename = "movie_type";
	await runQueryTestsAsync<TaxonomyPayload<DeliveryClientSchema>>({
		endpoint: `taxonomies/${codename}`,
		unitTestPayload,
		selectQuery: (client) => client.fetchTaxonomy({ codename: codename }),
		expectedSchema: taxonomyPayload(getIntegrationTestsSchema()),
	});
});
