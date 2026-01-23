import { getQuery, type Query } from "@kontent-ai/core-sdk";
import z from "zod";
import { deliverySdkInfo } from "../../delivery-sdk-info.js";
import type { DeliveryClient, DeliveryClientConfig, DeliveryClientSchema } from "../../models/core.models.js";
import { getDeliveryEndpointUrl } from "../../utils/url.utils.js";
import { getListLanguagesPayloadSchema, type ListLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TLanguageCodenames extends string> = Query<ListLanguagesPayload<TLanguageCodenames>>;

export function getListLanguagesQuery<TLanguageCodenames extends string>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TLanguageCodenames>,
): ReturnType<DeliveryClient<TLanguageCodenames>["listLanguages"]> {
	const url = getDeliveryEndpointUrl({ path: "/languages", ...config });

	const codenames = schema.languageCodenames
		? z.enum(schema.languageCodenames)
		: (z.string() as unknown as z.ZodType<TLanguageCodenames>);

	const { toPromise } = getQuery<ListLanguagesPayload<TLanguageCodenames>, null>({
		config,
		sdkInfo: deliverySdkInfo,
		authorizationApiKey: config.deliveryApiKey,
		zodSchema: getListLanguagesPayloadSchema<TLanguageCodenames>(codenames),
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
