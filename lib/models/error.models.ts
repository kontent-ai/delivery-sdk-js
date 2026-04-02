import { KontentSdkError } from "@kontent-ai/core-sdk";

export class DeliverySdkError extends KontentSdkError {
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
