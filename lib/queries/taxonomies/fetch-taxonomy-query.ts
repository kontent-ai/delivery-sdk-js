import type { TaxonomyCodenameOf, TaxonomyTermCodenamesOf } from "../../models/codename.models.js";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery, DeliveryMetadata } from "../../models/core.models.js";
import type { DeliveryRequestWithCodename } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import type { TaxonomyPayload } from "./models/taxonomy.models.js";

export type FetchTaxonomyResponse<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TCodename extends TaxonomyCodenameOf<TSchema> = TaxonomyCodenameOf<TSchema>,
> = DeliveryResponse<TaxonomyPayload<TSchema, TaxonomyTermCodenamesOf<TSchema, TCodename>, TCodename>, DeliveryMetadata>;

export type FetchTaxonomyQuery<
	TSchema extends DeliveryClientSchema,
	TCodename extends TaxonomyCodenameOf<TSchema> = TaxonomyCodenameOf<TSchema>,
> = DeliveryFetchQuery<FetchTaxonomyResponse<TSchema, TCodename>["payload"], FetchTaxonomyResponse<TSchema, TCodename>["meta"]>;

export type FetchTaxonomyQueryRequest<
	TSchema extends DeliveryClientSchema,
	TCodename extends TaxonomyCodenameOf<TSchema> = TaxonomyCodenameOf<TSchema>,
> = DeliveryRequestWithCodename<FetchTaxonomyResponse<TSchema, TCodename>["payload"], readonly [TCodename], never, never>;

export function fetchTaxonomyQuery<TSchema extends DeliveryClientSchema, const TCodename extends TaxonomyCodenameOf<TSchema>>(
	config: DeliveryClientConfig,
	request: FetchTaxonomyQueryRequest<TSchema, TCodename>,
): FetchTaxonomyQuery<TSchema, TCodename> {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: request?.config?.schema,
		endpoint: `taxonomies/${encodeURIComponent(request.codename)}`,
	});
}
