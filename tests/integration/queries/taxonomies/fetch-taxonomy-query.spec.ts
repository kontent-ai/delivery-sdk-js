import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { TaxonomyPayload } from "../../../../lib/queries/taxonomies/models/taxonomy.models.js";
import { taxonomySchema } from "../../../../lib/queries/taxonomies/schemas/taxonomy.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import rawPayload from "./fetch-taxonomy-query.payload.js";

describe("Fetch taxonomy query", async () => {
	const codename = "movie_type";
	await runQueryTestsAsync<TaxonomyPayload<DeliveryClientSchema>>({
		endpoint: `taxonomies/${codename}`,
		rawPayload,
		selectQuery: (client) => client.fetchTaxonomy({ codename: codename }),
		expectedSchema: taxonomySchema(),
	});
});
