import { getQuery, type Query } from "@kontent-ai/core-sdk";
import { deliverySdkInfo } from "../../delivery-sdk-info.js";
import type { DeliveryClient, DeliveryClientConfig, DeliveryClientTypes } from "../../models/core.models.js";
import { getDeliveryEndpointUrl } from "../../utils/url.utils.js";
import { type ListLanguagesPayload, listLanguagesPayloadSchema } from "./language.models.js";

export type ListLanguagesQuery = Query<ListLanguagesPayload>;

export function getListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
): ReturnType<DeliveryClient<TDeliveryClientTypes>["listLanguages"]> {
	const url = getDeliveryEndpointUrl({ path: "/languages", ...config });

	const { toPromise } = getQuery<ListLanguagesPayload, null>({
		config,
		sdkInfo: deliverySdkInfo,
		authorizationApiKey: config.deliveryApiKey,
		zodSchema: listLanguagesPayloadSchema,
		continuationToken: undefined,
		extraMetadata: () => {
			return {};
		},
		request: {
			url,
			body: null,
			method: "GET",
		},
	});

	return {
		toUrl: () => url,
		toPromise,
	};
}
