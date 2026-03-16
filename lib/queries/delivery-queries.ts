import { createPagedFetchQuery, type PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { ZodType } from "zod";
import { deliverySdkInfo } from "../delivery-sdk-info.js";
import type {
	DefaultDeliveryClientSchema,
	DeliveryClientConfigWithSchema,
	DeliveryEndpoints,
	PaginationSchema,
} from "../models/core.models.js";
import { getNextPageByUrl } from "../utils/paging.utils.js";
import { getDeliveryUrl } from "../utils/url.utils.js";

export function createDeliveryPagingQuery<TPayload extends PaginationSchema>({
	config,
	zodSchema,
	endpoint,
}: {
	readonly config: DeliveryClientConfigWithSchema<DefaultDeliveryClientSchema>;
	readonly zodSchema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoints;
}): PagedFetchQuery<TPayload, null> {
	return createPagedFetchQuery<TPayload, null>({
		config,
		zodSchema: zodSchema,
		sdkInfo: deliverySdkInfo,
		mapMetadata: () => {
			return null;
		},
		getNextPageData: getNextPageByUrl(),
		request: {
			url: getDeliveryUrl({ path: endpoint, ...config }),
			authorizationApiKey: config.apiMode === "preview" || config.apiMode === "secure" ? config.deliveryApiKey : undefined,
		},
	});
}
