import type { CreateDeliveryClientOptions, DeliveryClient, DeliveryClientConfig, DeliveryClientSchema } from "../models/core.models.js";
import { getListLanguagesQuery } from "../queries/languages/list-languages-query.js";

type DeliverySchemaBuilder = {
	withSchema: <TLanguageCodenames extends string>(
		schema: DeliveryClientSchema<TLanguageCodenames>,
	) => DeliveryApiBuilder<TLanguageCodenames>;
	withUnknownSchema: () => DeliveryApiBuilder<string>;
};

type DeliveryApiBuilder<TLanguageCodenames extends string> = {
	/**
	 * Use publicly available API for requests.
	 */
	publicApi: () => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TLanguageCodenames>;
	};
	/**
	 * Use preview API for requests.
	 *
	 * Requires a delivery API key with preview access.
	 */
	previewApi: (deliveryApiKey: string) => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TLanguageCodenames>;
	};

	/**
	 * Use secure API for requests.
	 *
	 * Requires a delivery API key with secure access.
	 */
	secureApi: (deliveryApiKey: string) => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TLanguageCodenames>;
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
		withSchema: <TLanguageCodenames extends string>(schema: DeliveryClientSchema<TLanguageCodenames>) => {
			return getApiBuilder(environmentId, schema);
		},
		withUnknownSchema: () => {
			return getApiBuilder(environmentId, { languageCodenames: undefined });
		},
	};
}

function getApiBuilder<TLanguageCodenames extends string>(environmentId: string, schema: DeliveryClientSchema<TLanguageCodenames>) {
	return {
		publicApi: () => {
			return withClient<TLanguageCodenames>({ apiMode: "public", environmentId }, schema);
		},
		previewApi: (deliveryApiKey: string) => {
			return withClient<TLanguageCodenames>({ apiMode: "preview", environmentId, deliveryApiKey }, schema);
		},
		secureApi: (deliveryApiKey: string) => {
			return withClient<TLanguageCodenames>({ apiMode: "secure", environmentId, deliveryApiKey }, schema);
		},
	};
}

function withClient<TLanguageCodenames extends string>(
	requiredConfig: Pick<DeliveryClientConfig, "environmentId" | "apiMode" | "deliveryApiKey">,
	schema: DeliveryClientSchema<TLanguageCodenames>,
) {
	return {
		create: (options?: CreateDeliveryClientOptions): DeliveryClient<TLanguageCodenames> =>
			createDeliveryClient<TLanguageCodenames>({ ...requiredConfig, ...options }, schema),
	};
}

function createDeliveryClient<TLanguageCodenames extends string>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TLanguageCodenames>,
): DeliveryClient<TLanguageCodenames> {
	return {
		config,
		listLanguages: () => getListLanguagesQuery<TLanguageCodenames>(config, schema),
	};
}
