import { getEndpointUrl } from "@kontent-ai/core-sdk";
import type { ApiMode, DeliveryClientConfig, DeliveryEndpoints } from "../models/core.models.js";

export function getDeliveryUrl({
	environmentId,
	path,
	baseUrl,
	apiMode,
}: { readonly path: DeliveryEndpoints } & Pick<DeliveryClientConfig, "baseUrl" | "environmentId" | "apiMode">): string {
	return getEndpointUrl({
		environmentId,
		path,
		baseUrl: baseUrl ?? getDefaultBaseUrlForApiMode(apiMode),
	});
}

function getDefaultBaseUrlForApiMode(apiMode: ApiMode): string {
	if (apiMode === "preview") {
		return "https://preview-deliver.kontent.ai";
	}

	// Both "public" and "secure" modes use the same base URL.
	// Secure mode is distinguished by the Authorization header, not a different endpoint.
	return "https://deliver.kontent.ai";
}
