import type { AdapterResponse, ContinuationHeaderName, SdkConfig } from "@kontent-ai/core-sdk";
import z from "zod";
import type { ListLanguagesQuery } from "../queries/languages/list-languages-query.js";

export type DeliveryClientTypes = {
	readonly languageCodenames: string;
	readonly typeCodenames: string;
	readonly workflowCodenames: string;
	readonly workflowStepCodenames: string;
	readonly collectionCodenames: string;
	readonly taxonomyCodenames: string;
};

export type DeliveryResponseMeta<TExtraMetadata = unknown> = Pick<AdapterResponse, "status" | "responseHeaders"> & {
	readonly continuationToken?: string;
} & TExtraMetadata;

export type DeliveryResponse<TPayload, TExtraMetadata = unknown> = {
	readonly payload: TPayload;
	readonly meta: DeliveryResponseMeta<TExtraMetadata>;
};

export type ApiMode = "public" | "preview" | "secure";

export type DeliveryClientConfig = SdkConfig & {
	/**
	 * The environment ID of your Kontent.ai project. Can be found under 'Project settings' in the Kontent.ai app.
	 */
	readonly environmentId: string;

	/**
	 * Delivery API key.
	 *
	 * Required for secure and preview modes.
	 */
	readonly deliveryApiKey?: string;

	/**
	 * Mode for the API.
	 *
	 * Secure mode requires a delivery API key with secure access.
	 * Preview mode requires a delivery API key with preview access.
	 * Delivery mode is used for public access.
	 */
	readonly apiMode: ApiMode;
};

/**
 * Sync client instance.
 *
 * @param TSyncApiTypes - The types representing your Kontent.ai environment.
 * Can be used to narrow down the types of the response payload.
 * For example, the codenames of langauges, content types etc. can be narrowed.
 */
export type DeliveryClient<TDeliveryApiTypes extends DeliveryClientTypes = DeliveryClientTypes> = {
	readonly config: DeliveryClientConfig;

	/**
	 * Initializes synchronization of changes in all of the supported entities.
	 * After the initialization, you’ll get the X-Continuation token which you
	 * should store for later use in the 'sync' function.
	 */
	listLanguages(): ListLanguagesQuery;
};

export type CreateDeliveryClientOptions = Omit<DeliveryClientConfig, "environmentId" | "apiMode" | "deliveryApiKey">;

export class MissingContinuationTokenError extends Error {
	constructor() {
		super(`Missing '${"X-Continuation" satisfies ContinuationHeaderName}' header`);
	}
}

export const paginationSchema = z.object({
	pagination: z
		.object({
			skip: z.number(),
			limit: z.number(),
			count: z.number(),
			next_page: z.string(),
		})
		.readonly(),
});

export type PaginationSchema = Readonly<z.infer<typeof paginationSchema>>;

export type PayloadWithPagination<TPayload> = TPayload & PaginationSchema;
