import type { DeliveryClientSchema, DeliveryClientTypes } from "../models/core.models.js";

export function toRequiredSchema<TDeliveryClientTypes extends DeliveryClientTypes>(
	schema?: DeliveryClientSchema<TDeliveryClientTypes>,
): DeliveryClientSchema<TDeliveryClientTypes> {
	return schema ?? { languageCodenames: [], taxonomyCodenames: [] };
}
