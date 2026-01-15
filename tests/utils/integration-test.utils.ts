import { getDefaultHttpService, type HttpResponse, type JsonValue, type ResultOfSuccessfulQuery } from "@kontent-ai/core-sdk";
import type { SyncClient, SyncClientTypes, SyncQuery } from "../../lib/public_api.js";
import { getIntegrationTestConfig } from "../integration-tests.config.js";

type ElementChangeEntityData = { readonly value: string } & ElementData;

type SharedEntityData = {
	readonly codename: string;
	readonly name: string;
};

type ElementData = { readonly type: "text" } & SharedEntityData;

type LanguageVariantData = {
	readonly elements: readonly {
		readonly element: {
			readonly codename: string;
		};
		readonly value: string;
	}[];
};

const config = getIntegrationTestConfig();
const httpService = getDefaultHttpService({
	requestHeaders: [
		{
			name: "Authorization",
			value: `Bearer ${config.env.mapiKey}`,
		},
	],
	retryStrategy: {
		maxRetries: 10,
		logRetryAttempt: false,
		getDelayBetweenRetriesMs: () => 500,
	},
});

export async function prepareEnvironmentAsync({
	item,
	type,
	taxonomy,
}: Parameters<typeof processChangesForIntegrationTestAsync>[0]): Promise<void> {
	await Promise.all([
		deleteEntityAndWaitUntilPropagatedToDeliveryApiAsync({
			deleteUrl: config.mapiUrls.taxonomy(taxonomy.codename),
			deliveryGetUrl: config.deliveryUrls.taxonomy(taxonomy.codename),
		}),
		deleteEntityAndWaitUntilPropagatedToDeliveryApiAsync({
			deleteUrl: config.mapiUrls.contentItem(item.codename),
			deliveryGetUrl: config.deliveryUrls.contentItem(item.codename),
		}),
	]);

	await deleteEntityAndWaitUntilPropagatedToDeliveryApiAsync({
		deleteUrl: config.mapiUrls.contentType(type.codename),
		deliveryGetUrl: config.deliveryUrls.contentType(type.codename),
	});
}

export async function processChangesForIntegrationTestAsync({
	item,
	type,
	element,
	language,
	taxonomy,
}: {
	readonly type: SharedEntityData;
	readonly element: ElementChangeEntityData;
	readonly item: SharedEntityData;
	readonly language: SharedEntityData;
	readonly taxonomy: SharedEntityData;
}): Promise<void> {
	// first prepare the environment by creating the content type, taxonomy and renaming the language
	await Promise.all([createContentTypeAsync(type, element), createTaxonomyAsync(taxonomy), renameLanguageAsync(language)]);

	// then create the content item and variant
	await createContentItemAndVariantAsync(item, type, language, element);
}

export async function pollSyncApiAsync<T>({
	token,
	client,
	getDeltaObject,
	retryAttempt,
	maxRetries,
	pollWaitInMs,
}: {
	readonly client: SyncClient<SyncClientTypes>;
	readonly pollWaitInMs: number;
	readonly token: string;
	readonly getDeltaObject: (response: ResultOfSuccessfulQuery<SyncQuery<SyncClientTypes>>) => T | undefined;
	readonly retryAttempt: number;
	readonly maxRetries: number;
}): Promise<
	| { readonly success: true; readonly deltaObject: T; readonly syncResponse: ResultOfSuccessfulQuery<SyncQuery<SyncClientTypes>> }
	| { readonly success: false; readonly deltaObject?: never; readonly syncResponse?: never }
> {
	if (retryAttempt >= maxRetries) {
		return {
			success: false,
		};
	}

	const { response: syncResponse, success } = await client.sync(token).toPromise();

	if (!success) {
		throw new Error("Failed to get sync response. The request should always succeed.");
	}

	const deltaObject = getDeltaObject(syncResponse);

	if (deltaObject) {
		return {
			success: true,
			deltaObject,
			syncResponse,
		};
	}

	await waitAsync(pollWaitInMs);
	return await pollSyncApiAsync({
		client,
		getDeltaObject,
		token,
		retryAttempt: retryAttempt + 1,
		maxRetries,
		pollWaitInMs,
	});
}

export async function waitUntilDeliveryEntityIsDeletedAsync({
	fetchEntityUrl,
	retryAttempt,
	maxRetries,
	pollWaitInMs,
}: {
	readonly pollWaitInMs: number;
	readonly fetchEntityUrl: string;
	readonly retryAttempt: number;
	readonly maxRetries: number;
}): Promise<void> {
	if (retryAttempt >= maxRetries) {
		return;
	}

	const { error, success } = await httpService.requestAsync({
		url: fetchEntityUrl,
		body: null,
		method: "GET",
	});

	if (success) {
		// if response is valid, it means the deleted entity is still available in delivery API
		await waitAsync(pollWaitInMs);
		return await waitUntilDeliveryEntityIsDeletedAsync({
			fetchEntityUrl,
			retryAttempt: retryAttempt + 1,
			maxRetries,
			pollWaitInMs,
		});
	}

	if (error.details.reason === "notFound") {
		// if entity is not found, it means it has been deleted and the change propagation is complete
		return;
	}

	throw new Error(`Failed to wait until entity is deleted: ${fetchEntityUrl}`, { cause: error });
}

async function renameLanguageAsync(language: SharedEntityData): Promise<void> {
	await httpService.requestAsync<
		SharedEntityData,
		{
			op: "replace";
			property_name: "name";
			value: string;
		}[]
	>({
		url: config.mapiUrls.language(language.codename),
		body: [
			{
				op: "replace",
				property_name: "name",
				value: language.name,
			},
		],
		method: "PATCH",
	});
}

async function createTaxonomyAsync(taxonomy: SharedEntityData): Promise<void> {
	await httpService.requestAsync<SharedEntityData, SharedEntityData & { terms: [] }>({
		url: config.mapiUrls.taxonomies,
		body: {
			codename: taxonomy.codename,
			name: taxonomy.name,
			terms: [],
		},
		method: "POST",
	});
}

async function createContentTypeAsync(type: SharedEntityData, element: ElementChangeEntityData): Promise<void> {
	await httpService.requestAsync<
		SharedEntityData,
		SharedEntityData & {
			readonly elements: readonly ElementData[];
		}
	>({
		url: config.mapiUrls.contentTypes,
		body: {
			codename: type.codename,
			name: type.name,
			elements: [
				{
					codename: element.codename,
					name: element.name,
					type: element.type,
				},
			],
		},
		method: "POST",
	});
}

async function waitAsync(ms: number): Promise<void> {
	return await new Promise((resolve) => {
		setTimeout(resolve, ms);
		return;
	});
}

async function deleteEntityAndWaitUntilPropagatedToDeliveryApiAsync({
	deleteUrl,
	deliveryGetUrl,
}: {
	readonly deleteUrl: string;
	readonly deliveryGetUrl: string;
}): Promise<void> {
	await skip404ErrorsAsync(async () => {
		return await httpService.requestAsync<SharedEntityData, null>({
			url: deleteUrl,
			body: null,
			method: "DELETE",
		});
	});

	await waitUntilDeliveryEntityIsDeletedAsync({
		fetchEntityUrl: deliveryGetUrl,
		maxRetries: 30,
		pollWaitInMs: 1000,
		retryAttempt: 0,
	});
}

async function createContentItemAndVariantAsync(
	item: SharedEntityData,
	type: SharedEntityData,
	language: SharedEntityData,
	element: ElementChangeEntityData,
): Promise<void> {
	await httpService.requestAsync<
		SharedEntityData,
		SharedEntityData & {
			readonly type: {
				readonly codename: string;
			};
		}
	>({
		url: config.mapiUrls.contentItems,
		body: {
			codename: item.codename,
			name: item.name,
			type: {
				codename: type.codename,
			},
		},
		method: "POST",
	});

	await httpService.requestAsync<null, LanguageVariantData>({
		url: config.mapiUrls.languageVariant(item.codename, language.codename),
		body: {
			elements: [
				{
					element: {
						codename: element.codename,
					},
					value: element.value,
				},
			],
		},
		method: "PUT",
	});

	await httpService.requestAsync<null, null>({
		url: config.mapiUrls.publish(item.codename, language.codename),
		body: null,
		method: "PUT",
	});
}

async function skip404ErrorsAsync<T extends JsonValue>(fn: () => Promise<HttpResponse<T, null>>): Promise<T | undefined> {
	const { error, success, response } = await fn();

	if (success) {
		return response.data;
	}

	if (error.details.reason === "notFound") {
		return undefined;
	}

	if (error.details.reason === "invalidResponse" && error.details.status === 401) {
		throw new Error(`${error.message} ${error.details.kontentErrorResponse?.message}`, { cause: error });
	}

	throw new Error(`Failed to skip 404 errors. ${error.message}`, { cause: error });
}
