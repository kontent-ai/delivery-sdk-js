import { getQuery, type Query } from "@kontent-ai/core-sdk";
import { deliverySdkInfo } from "../../delivery-sdk-info.js";
import type { DeliveryClient, DeliveryClientConfig, DeliveryClientSchema } from "../../models/core.models.js";
import { getCodenameShema } from "../../utils/type.utils.js";
import { getDeliveryEndpointUrl } from "../../utils/url.utils.js";
import { type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TLanguageCodenames extends string> = Query<ListLanguagesPayload<TLanguageCodenames>>;

export function getListLanguagesQuery<TLanguageCodenames extends string>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TLanguageCodenames>,
): ReturnType<DeliveryClient<TLanguageCodenames>["listLanguages"]> {
	const url = getDeliveryEndpointUrl({ path: "/languages", ...config });

	const { toPromise } = getQuery<ListLanguagesPayload<TLanguageCodenames>, null>({
		config,
		zodSchema: listLanguagesPayload(getCodenameShema(schema.languageCodenames)),
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
