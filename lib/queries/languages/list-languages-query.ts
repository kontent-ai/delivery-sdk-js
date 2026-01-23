import { getQuery, type Query } from "@kontent-ai/core-sdk";
import z from "zod";
import { deliverySdkInfo } from "../../delivery-sdk-info.js";
import type { DeliveryClient, DeliveryClientConfig, DeliveryClientSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { getDeliveryEndpointUrl } from "../../utils/url.utils.js";
import { getListLanguagesPayloadSchema, type ListLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TDeliveryApiTypes extends DeliveryClientTypes> = Query<ListLanguagesPayload<TDeliveryApiTypes>>;

export function getListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): ReturnType<DeliveryClient<TDeliveryClientTypes>["listLanguages"]> {
	const url = getDeliveryEndpointUrl({ path: "/languages", ...config });
	const codenames = schema ? z.templateLiteral([z.enum(schema.languageCodenames)]) : z.templateLiteral([z.string()]);

	const { toPromise } = getQuery<ListLanguagesPayload<TDeliveryClientTypes>, null>({
		config,
		sdkInfo: deliverySdkInfo,
		authorizationApiKey: config.deliveryApiKey,
		zodSchema: getListLanguagesPayloadSchema(codenames),
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
