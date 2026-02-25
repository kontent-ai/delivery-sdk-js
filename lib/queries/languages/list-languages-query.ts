import { createPagingQuery, type PagingQuery } from "@kontent-ai/core-sdk";
import { deliverySdkInfo } from "../../delivery-sdk-info.js";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { getNextPageByUrl } from "../../utils/paging.utils.js";
import { getDeliveryEndpointUrl } from "../../utils/url.utils.js";
import { type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes> = PagingQuery<
	ListLanguagesPayload<TDeliveryClientTypes>,
	null
>;

export function createListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): ListLanguagesQuery<TDeliveryClientTypes> {
	return createPagingQuery<ListLanguagesPayload<TDeliveryClientTypes>, null, null>({
		config,
		zodSchema: listLanguagesPayload(schema),
		sdkInfo: deliverySdkInfo,
		authorizationApiKey: config.deliveryApiKey,
		mapMetadata: () => {
			return null;
		},
		getNextPageData: getNextPageByUrl(),
		request: {
			url: getDeliveryEndpointUrl({ path: "/languages", ...config }),
			body: null,
			method: "GET",
		},
	});
}
