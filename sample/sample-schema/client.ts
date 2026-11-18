/**
 * Sample: the typed delivery client.
 *
 * Pass the schema and the item union to `createDeliveryClient`. Every query of this client is then checked
 * against the schema, and content item responses are typed as the item union.
 */

import { createDeliveryClient, type DeliveryClient } from "../../lib/public_api.js";
import type { SampleItem } from "./sample-project.models.js";
import type { SampleProjectSchema } from "./sample-project.schema.js";

export type SampleDeliveryClient = DeliveryClient<SampleProjectSchema, SampleItem>;

export const client: SampleDeliveryClient = createDeliveryClient<SampleProjectSchema, SampleItem>({
	apiMode: "public",
	environmentId: "x",
});
