import type { JsonValue, QueryResponse } from "@kontent-ai/core-sdk";
import type { DeliveryMetadata, DeliveryMetadataWithToken } from "./core.models.js";

/**
 * A resolved delivery query response — what `await query.fetch()` / `.fetchPage()` returns.
 * Response-side counterpart to {@link DeliveryFetchQuery}; wraps core-sdk's `QueryResponse` so query
 * modules and consumers don't depend on `@kontent-ai/core-sdk` directly.
 */
export type DeliveryResponse<TPayload extends JsonValue, TMeta extends DeliveryMetadata | DeliveryMetadataWithToken> = QueryResponse<
	TPayload,
	TMeta
>;
