import {
	type ContinuationTokenHeaderName,
	type FetchQuery,
	type Header,
	type JsonValue,
	type KontentSdkError,
	nilUuid,
	type PagedFetchQuery,
} from "@kontent-ai/core-sdk";

export const fakeXContinuationTokenHeader: Header = {
	name: "X-Continuation" satisfies ContinuationTokenHeaderName,
	value: "x",
};

export const unitEnvironmentId = "xyz";

export function getFakeUuid(): string {
	return nilUuid;
}

export function isFetchQueryWithExpectedFunctions(query: unknown): query is FetchQuery<JsonValue, unknown, KontentSdkError> {
	type ExpectedFunctions = keyof FetchQuery<JsonValue, unknown, KontentSdkError>;
	if (!query || typeof query !== "object") {
		return false;
	}

	const expectedFunctions: readonly ExpectedFunctions[] = ["fetchSafe", "fetch", "inspect"];

	if (expectedFunctions.every((func) => func in query)) {
		return true;
	}
	return false;
}

export function isPagedFetchQueryWithExpectedFunctions(query: unknown): query is PagedFetchQuery<JsonValue, unknown, KontentSdkError> {
	type ExpectedFunctions = keyof PagedFetchQuery<JsonValue, unknown, KontentSdkError>;
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
