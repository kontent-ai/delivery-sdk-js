import { createPagingQuery, type PagingQuery } from "@kontent-ai/core-sdk";
import type { ZodType } from "zod";
import { deliverySdkInfo } from "../delivery-sdk-info.js";
import type { DeliveryClientConfig, DeliveryEndpoints, PaginationSchema } from "../models/core.models.js";
import { getNextPageByUrl } from "../utils/paging.utils.js";
import { getDeliveryUrl } from "../utils/url.utils.js";

export function createDeliveryPagingQuery<TPayload extends PaginationSchema>({
	config,
	zodSchema,
	endpoint,
}: {
	readonly config: DeliveryClientConfig;
	readonly zodSchema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoints;
}): PagingQuery<TPayload, null> {
	return createPagingQuery<TPayload, null, null>({
		config,
		zodSchema: zodSchema,
		sdkInfo: deliverySdkInfo,
		authorizationApiKey: config.deliveryApiKey,
		mapMetadata: () => {
			return null;
		},
		getNextPageData: getNextPageByUrl(),
		request: {
			url: getDeliveryUrl({ path: endpoint, ...config }),
			body: null,
			method: "GET",
		},
	});
}
