import type { KontentSdkError } from "@kontent-ai/core-sdk";
import { DeliverySdkError } from "../models/error.models.js";

export function mapDeliveryError(error: KontentSdkError): DeliverySdkError {
	return new DeliverySdkError(error);
}
