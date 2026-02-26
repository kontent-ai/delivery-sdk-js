import { createPagingQuery, type PagingQuery } from "@kontent-ai/core-sdk";
import { deliverySdkInfo } from "../../delivery-sdk-info.js";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { getNextPageByUrl } from "../../utils/paging.utils.js";
import { getDeliveryUrl } from "../../utils/url.utils.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TDeliveryClientTypes extends DeliveryClientTypes> = PagingQuery<
	ListTaxonomiesPayload<TDeliveryClientTypes>,
	null
>;

export function listTaxonomiesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): ListTaxonomiesQuery<TDeliveryClientTypes> {
	return createPagingQuery<ListTaxonomiesPayload<TDeliveryClientTypes>, null, null>({
		config,
		zodSchema: listTaxonomiesPayload(schema),
		sdkInfo: deliverySdkInfo,
		authorizationApiKey: config.deliveryApiKey,
		mapMetadata: () => {
			return null;
		},
		getNextPageData: getNextPageByUrl(),
		request: {
			url: getDeliveryUrl({ path: "taxonomies", ...config }),
			body: null,
			method: "GET",
		},
	});
}
