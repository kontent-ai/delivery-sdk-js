import { createQuery, type Query } from "@kontent-ai/core-sdk";
import { deliverySdkInfo } from "../../delivery-sdk-info.js";
import type { DeliveryClient, DeliveryClientConfig, DeliveryClientSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { getDeliveryEndpointUrl } from "../../utils/url.utils.js";
import { type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes> = Query<ListLanguagesPayload<TDeliveryClientTypes>>;

export function getListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): ReturnType<DeliveryClient<TDeliveryClientTypes>["listLanguages"]> {
	const url = getDeliveryEndpointUrl({ path: "/languages", ...config });

	const { toPromise } = createQuery<ListLanguagesPayload<TDeliveryClientTypes>, null>({
		config,
		zodSchema: listLanguagesPayload(schema),
		sdkInfo: deliverySdkInfo,
		authorizationApiKey: config.deliveryApiKey,
		mapMetadata: () => {
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
