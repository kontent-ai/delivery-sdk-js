import type { DeliveryClientSchema, PartialDeliveryClientShema } from "../models/core.models.js";

export function getDefaultSchema(): DeliveryClientSchema {
	return {
		languageCodenames: [],
		taxonomyCodenames: [],
		contentTypeCodenames: [],
	};
}

export function toFullSchema<TSchema extends PartialDeliveryClientShema>(schema: TSchema): DeliveryClientSchema<TSchema> {
	return {
		languageCodenames: schema.languageCodenames ?? [],
		taxonomyCodenames: schema.taxonomyCodenames ?? [],
		contentTypeCodenames: schema.contentTypeCodenames ?? [],
	};
}
