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

export function getEndpointUrl({
	environmentId,
	path,
	baseUrl,
}: {
	readonly environmentId: string;
	readonly path: string;
	readonly baseUrl: string;
}): string {
	return removeDuplicateSlashes(`${baseUrl}/${environmentId}/${path}`);
}

function getDefaultBaseUrlForApiMode(apiMode: ApiMode): string {
	if (apiMode === "preview") {
		return "https://preview-deliver.kontent.ai";
	}

	return "https://deliver.kontent.ai";
}

function removeDuplicateSlashes(path: string): string {
	return path.replace(/\/+/g, "/");
}
