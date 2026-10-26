import { KontentSdkError } from "@kontent-ai/core-sdk";

/**
 * Brands identify Delivery SDK errors even when they come from a different copy / version of this package,
 * where `instanceof` fails. `Symbol.for` returns the same symbol across copies.
 */
export const deliverySdkErrorBrands = {
	deliverySdkError: Symbol.for("kontentAi.DeliverySdkError"),
} as const;

export class DeliverySdkError extends KontentSdkError {
	readonly [deliverySdkErrorBrands.deliverySdkError] = true;

	constructor(error: KontentSdkError) {
		super({
			baseErrorData: {
				message: error.message,
				url: error.url,
				retryStrategyOptions: error.retryStrategyOptions,
				retryAttempt: error.retryAttempt,
			},
			details: error.details,
		});
	}
}
