import type { KontentSdkError } from "@kontent-ai/core-sdk";
import { DeliverySdkError, deliverySdkErrorBrands } from "../models/error.models.js";

export function mapDeliveryError(error: KontentSdkError): DeliverySdkError {
	return new DeliverySdkError(error);
}

/**
 * Checks whether the given value is a `DeliverySdkError`. Unlike `instanceof`, it also recognizes errors
 * created by a different copy / version of this package.
 */
export function isDeliverySdkError(error: unknown): error is DeliverySdkError {
	return error instanceof DeliverySdkError || hasBrand(error, deliverySdkErrorBrands.deliverySdkError);
}

function hasBrand(value: unknown, brand: symbol): boolean {
	return typeof value === "object" && value !== null && (value as Readonly<Record<symbol, unknown>>)[brand] === true;
}
