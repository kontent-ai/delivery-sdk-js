import type { CreateDeliveryClientOptions, DeliveryClient, DeliveryClientConfig, DeliveryClientTypes } from "../models/core.models.js";
import { getListLanguagesQuery } from "../queries/languages/list-languages-query.js";

type GetDeliveryClient<TSyncApiTypes extends DeliveryClientTypes = DeliveryClientTypes> = {
	/**
	 * Use publicly available API for requests.
	 */
	publicApi: () => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TSyncApiTypes>;
	};
	/**
	 * Use preview API for requests.
	 *
	 * Requires a delivery API key with preview access.
	 */
	previewApi: (deliveryApiKey: string) => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TSyncApiTypes>;
	};

	/**
	 * Use secure API for requests.
	 *
	 * Requires a delivery API key with secure access.
	 */
	secureApi: (deliveryApiKey: string) => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TSyncApiTypes>;
	};
};

/**
 * Creates a new sync client instance using fluent API.
 *
 * You may choose to use public, preview or secure API.
 *
 * Options can be set within the 'create' function.
 *
 * @param environmentId - The Id of the Kontent.ai environment.
 */
export function getDeliveryClient<TDeliveryClientTypes extends DeliveryClientTypes = DeliveryClientTypes>(
	environmentId: string,
): GetDeliveryClient<TDeliveryClientTypes> {
	return {
		publicApi: () => {
			return withClient<TDeliveryClientTypes>({ apiMode: "public", environmentId });
		},
		previewApi: (deliveryApiKey: string) => {
			return withClient<TDeliveryClientTypes>({ apiMode: "preview", environmentId, deliveryApiKey });
		},
		secureApi: (deliveryApiKey: string) => {
			return withClient<TDeliveryClientTypes>({ apiMode: "secure", environmentId, deliveryApiKey });
		},
	};
}

function withClient<TDeliveryClientTypes extends DeliveryClientTypes>(
	requiredConfig: Pick<DeliveryClientConfig, "environmentId" | "apiMode" | "deliveryApiKey">,
) {
	return {
		create: (options?: CreateDeliveryClientOptions): DeliveryClient<TDeliveryClientTypes> =>
			createDeliveryClient<TDeliveryClientTypes>({ ...requiredConfig, ...options }),
	};
}

function createDeliveryClient<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
): DeliveryClient<TDeliveryClientTypes> {
	return {
		config,
		listLanguages: () => getListLanguagesQuery<TDeliveryClientTypes>(config),
	};
}
