import type { AdapterResponse, ContinuationHeaderName, SdkConfig } from "@kontent-ai/core-sdk";
import z from "zod";
import type { ListLanguagesQuery } from "../queries/languages/list-languages-query.js";

export type DeliveryClientTypes = {
	// readonly contentItemType: IContentItem;
	// readonly contentTypeCodenames: string;
	// readonly workflowCodenames: string;
	// readonly workflowStepCodenames: string;
	// readonly collectionCodenames: string;
	// readonly taxonomyCodenames: string;
	readonly languageCodenames: string;
	// readonly elementCodenames: string;
};

export type DeliveryClientSchema<TDeliveryClientTypes extends DeliveryClientTypes> =
	| {
			readonly languageCodenames: readonly TDeliveryClientTypes["languageCodenames"][];
	  }
	| undefined;

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
	 * List languages.
	 */
	listLanguages(): ListLanguagesQuery<TDeliveryApiTypes>;
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
