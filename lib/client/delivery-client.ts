import type {
	CreateDeliveryClientOptions,
	DeliveryClient,
	DeliveryClientConfig,
	DeliveryClientSchema,
	DeliveryClientTypes,
} from "../models/core.models.js";
import { getListLanguagesQuery } from "../queries/languages/list-languages-query.js";

type DeliverySchemaBuilder = {
	withSchema: <TDeliveryClientTypes extends DeliveryClientTypes>(
		schema: DeliveryClientSchema<TDeliveryClientTypes>,
	) => DeliveryApiBuilder<TDeliveryClientTypes>;
	withUnknownSchema: () => DeliveryApiBuilder<DeliveryClientTypes>;
};

type DeliveryApiBuilder<TDeliveryApiTypes extends DeliveryClientTypes = DeliveryClientTypes> = {
	/**
	 * Use publicly available API for requests.
	 */
	publicApi: () => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TDeliveryApiTypes>;
	};
	/**
	 * Use preview API for requests.
	 *
	 * Requires a delivery API key with preview access.
	 */
	previewApi: (deliveryApiKey: string) => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TDeliveryApiTypes>;
	};

	/**
	 * Use secure API for requests.
	 *
	 * Requires a delivery API key with secure access.
	 */
	secureApi: (deliveryApiKey: string) => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TDeliveryApiTypes>;
	};
};

/**
 * Creates a new delivery client instance using fluent API.
 *
 * You may choose to use public, preview or secure API.
 *
 * Options can be set within the 'create' function.
 *
 * @param environmentId - The Id of the Kontent.ai environment.
 */
export function getDeliveryClient(environmentId: string): DeliverySchemaBuilder {
	return {
		withSchema: <TDeliveryClientTypes extends DeliveryClientTypes>(schema: DeliveryClientSchema<TDeliveryClientTypes>) => {
			return getApiBuilder(environmentId, schema);
		},
		withUnknownSchema: () => {
			return getApiBuilder(environmentId, undefined);
		},
	};
}

function getApiBuilder<TDeliveryClientTypes extends DeliveryClientTypes>(
	environmentId: string,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
) {
	return {
		publicApi: () => {
			return withClient<TDeliveryClientTypes>({ apiMode: "public", environmentId }, schema);
		},
		previewApi: (deliveryApiKey: string) => {
			return withClient<TDeliveryClientTypes>({ apiMode: "preview", environmentId, deliveryApiKey }, schema);
		},
		secureApi: (deliveryApiKey: string) => {
			return withClient<TDeliveryClientTypes>({ apiMode: "secure", environmentId, deliveryApiKey }, schema);
		},
	};
}

function withClient<TDeliveryClientTypes extends DeliveryClientTypes>(
	requiredConfig: Pick<DeliveryClientConfig, "environmentId" | "apiMode" | "deliveryApiKey">,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
) {
	return {
		create: (options?: CreateDeliveryClientOptions): DeliveryClient<TDeliveryClientTypes> =>
			createDeliveryClient<TDeliveryClientTypes>({ ...requiredConfig, ...options }, schema),
	};
}

function createDeliveryClient<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): DeliveryClient<TDeliveryClientTypes> {
	return {
		config,
		listLanguages: () => getListLanguagesQuery<TDeliveryClientTypes>(config, schema),
	};
}
