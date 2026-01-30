import { getQuery, type Query } from "@kontent-ai/core-sdk";
import { deliverySdkInfo } from "../../delivery-sdk-info.js";
import type { DeliveryClient, DeliveryClientConfig, DeliveryClientSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { getCodenameSchema } from "../../utils/type.utils.js";
import { getDeliveryEndpointUrl } from "../../utils/url.utils.js";
import { type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes> = Query<ListLanguagesPayload<TDeliveryClientTypes>>;

export function getListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): ReturnType<DeliveryClient<TDeliveryClientTypes>["listLanguages"]> {
	const url = getDeliveryEndpointUrl({ path: "/languages", ...config });

	const { toPromise } = getQuery<ListLanguagesPayload<TDeliveryClientTypes>, null>({
		config,
		zodSchema: listLanguagesPayload(getCodenameSchema(schema.languageCodenames)),
		sdkInfo: deliverySdkInfo,
		authorizationApiKey: config.deliveryApiKey,
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
