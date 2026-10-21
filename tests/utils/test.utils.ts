import {
	type ContinuationTokenHeaderName,
	type FetchQuery,
	type Header,
	type JsonValue,
	type KontentSdkError,
	nilUuid,
	type PagedFetchQuery,
} from "@kontent-ai/core-sdk";
import { stubFetchWithResponse } from "@kontent-ai/core-sdk/testkit";

const fakeXContinuationTokenHeader: Header = {
	name: "X-Continuation" satisfies ContinuationTokenHeaderName,
	value: "x",
};

export const unitEnvironmentId = "xyz";

export function stubFetchWithJsonResponse({
	jsonResponse,
	statusCode,
	continuationToken,
}: {
	readonly jsonResponse: JsonValue;
	readonly statusCode: number;
	readonly continuationToken?: string;
}): void {
	stubFetchWithResponse(
		() =>
			new Response(JSON.stringify(jsonResponse), {
				status: statusCode,
				headers: {
					"Content-Type": "application/json",
					...(continuationToken ? { [fakeXContinuationTokenHeader.name]: continuationToken } : {}),
				},
			}),
	);
}

export function getFakeUuid(): string {
	return nilUuid;
}

export function isFetchQueryWithExpectedFunctions(query: unknown): query is FetchQuery<JsonValue, KontentSdkError> {
	type ExpectedFunctions = keyof FetchQuery<JsonValue, KontentSdkError>;
	if (!query || typeof query !== "object") {
		return false;
	}

	const expectedFunctions: readonly ExpectedFunctions[] = ["fetchSafe", "fetch", "inspect"];

	if (expectedFunctions.every((func) => func in query)) {
		return true;
	}
	return false;
}

export function isPagedFetchQueryWithExpectedFunctions(query: unknown): query is PagedFetchQuery<JsonValue, KontentSdkError> {
	type ExpectedFunctions = keyof PagedFetchQuery<JsonValue, KontentSdkError>;
	if (!query || typeof query !== "object") {
		return false;
	}

	const expectedFunctions: readonly ExpectedFunctions[] = [
		"fetchAllPagesSafe",
		"fetchPageSafe",
		"pages",
		"inspect",
		"fetchAllPages",
		"fetchPage",
		"pagesSafe",
	];

	if (expectedFunctions.every((func) => func in query)) {
		return true;
	}
	return false;
}
