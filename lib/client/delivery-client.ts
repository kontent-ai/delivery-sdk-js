import type {
	CreateDeliveryClientOptions,
	DeliveryClient,
	DeliveryClientConfig,
	DeliveryClientSchema,
	DeliveryClientTypes,
} from "../models/core.models.js";
import { listLanguagesQuery } from "../queries/languages/list-languages-query.js";
import { listTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";

type DeliverySchemaBuilder = {
	/**
	 * By providing a schema, you get stronger type safety,
	 * which means many potential errors are caught at compile time rather than at runtime.
	 *
	 * Schemas can be generated using the `@kontent-ai/model-generator` npm package.
	 */
	withSchema: <TDeliveryClientTypes extends DeliveryClientTypes>(
		schema: DeliveryClientSchema<TDeliveryClientTypes>,
	) => DeliveryApiBuilder<TDeliveryClientTypes>;
	/**
	 * Use this only when you cannot provide a schema and have a strong reason to accept reduced type safety.
	 *
	 * Prefer `withSchema` whenever possible to ensure potential errors are caught at compile time
	 * rather than at runtime.
	 *
	 * Schemas can be generated using the `@kontent-ai/model-generator` npm package.
	 */
	withUnknownSchema: () => DeliveryApiBuilder<DeliveryClientTypes>;
};

type DeliveryApiBuilder<TDeliveryClientTypes extends DeliveryClientTypes> = {
	/**
	 * Use publicly available API for requests.
	 */
	publicApi: () => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TDeliveryClientTypes>;
	};
	/**
	 * Use preview API for requests.
	 *
	 * Requires a delivery API key with preview access.
	 */
	previewApi: (deliveryApiKey: string) => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TDeliveryClientTypes>;
	};

	/**
	 * Use secure API for requests.
	 *
	 * Requires a delivery API key with secure access.
	 */
	secureApi: (deliveryApiKey: string) => {
		create: (options?: CreateDeliveryClientOptions) => DeliveryClient<TDeliveryClientTypes>;
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
export function createDeliveryClient(environmentId: string): DeliverySchemaBuilder {
	return {
		withSchema: <TDeliveryClientTypes extends DeliveryClientTypes>(schema: DeliveryClientSchema<TDeliveryClientTypes>) => {
			return getApiBuilder<TDeliveryClientTypes>(environmentId, schema);
		},
		withUnknownSchema: () => {
			return getApiBuilder(environmentId, { languageCodenames: undefined });
		},
	};
}

function getApiBuilder<const TDeliveryClientTypes extends DeliveryClientTypes>(
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

function withClient<const TDeliveryClientTypes extends DeliveryClientTypes>(
	requiredConfig: Pick<DeliveryClientConfig, "environmentId" | "apiMode" | "deliveryApiKey">,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
) {
	return {
		create: (options?: CreateDeliveryClientOptions): DeliveryClient<TDeliveryClientTypes> =>
			buildDeliveryClient<TDeliveryClientTypes>({ ...requiredConfig, ...options }, schema),
	};
}

function buildDeliveryClient<const TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): DeliveryClient<TDeliveryClientTypes> {
	return {
		config,
		listLanguages: () => listLanguagesQuery<TDeliveryClientTypes>(config, schema),
		listTaxonomies: () => listTaxonomiesQuery<TDeliveryClientTypes>(config, schema),
	};
}
