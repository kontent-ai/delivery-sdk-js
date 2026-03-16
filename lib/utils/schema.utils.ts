import type { DefaultDeliveryClientSchema } from "../models/core.models.js";

const defaultSchema = {
	languageCodenames: [] as const,
	taxonomyCodenames: [] as const,
} satisfies DefaultDeliveryClientSchema;

export function toRequiredSchema<T extends DefaultDeliveryClientSchema | undefined>(
	schema?: T,
): [T] extends [undefined] ? DefaultDeliveryClientSchema : NonNullable<T> {
	return (schema ?? defaultSchema) as [T] extends [undefined] ? DefaultDeliveryClientSchema : NonNullable<T>;
}
