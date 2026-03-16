import type { DeliveryClientSchema, PartialDeliveryClientShema } from "../models/core.models.js";

/**
 * Resolves schema from config, filling defaults when undefined.
 * Centralizes the schema resolution so the delivery client stays assertion-free.
 */
export function resolveSchema<TSchema extends PartialDeliveryClientShema>(schema: TSchema | undefined): DeliveryClientSchema<TSchema> {
	return schema ? toFullSchema(schema) : getDefaultSchema();
}

function getDefaultSchema<TSchema extends PartialDeliveryClientShema>(): DeliveryClientSchema<TSchema> {
	return {
		languageCodenames: [],
		taxonomyCodenames: [],
		contentTypeCodenames: [],
	};
}

function toFullSchema<TSchema extends PartialDeliveryClientShema>(schema: TSchema): DeliveryClientSchema<TSchema> {
	return {
		languageCodenames: schema.languageCodenames ?? [],
		taxonomyCodenames: schema.taxonomyCodenames ?? [],
		contentTypeCodenames: schema.contentTypeCodenames ?? [],
	};
}
