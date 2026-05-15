import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ItemsReferencingAssetPayload } from "../../../../lib/queries/content-items/models/content-item.models.js";
import { itemsReferencingAssetSchema } from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./items-referencing-asset-query.payload.js";

describe("Items referencing asset query", async () => {
	const assetCodename = "the_dark_knight__2008_film__jpg";
	await runQueryTestsAsync<ItemsReferencingAssetPayload<DeliveryClientSchema>>({
		endpoint: `assets/${assetCodename}/used-in`,
		unitTestPayload,
		selectQuery: (client) => client.itemsReferencingAsset({ codename: assetCodename }),
		expectedSchema: itemsReferencingAssetSchema(),
	});
});
